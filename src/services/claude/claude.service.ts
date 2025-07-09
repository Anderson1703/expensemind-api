import Anthropic from "@anthropic-ai/sdk";
import { PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { processFilesForClaude } from "../../utils/compressor/compressor.util";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// Definición correcta de tipos para Anthropic API
interface ImageContent {
  type: "image" | "document";
  source: {
    type: "base64";
    media_type: string;
    data: string;
  };
}

interface TextContent {
  type: "text";
  text: string;
}

interface Message {
  role: "user" | "assistant";
  content: Array<ImageContent | TextContent>;
}

// Tipos para la respuesta esperada
interface ExtractedData {
  date: string;
  totalAmount: number;
  info?: string;
  business?: string;
  categoryId: string; // nuevo campo obligatorio
}

interface ErrorResponse {
  status: StatusCodes;
  message: string;
}

interface Category {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

type ExtractionResult = ExtractedData | ErrorResponse;

export class ClaudeService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Extrae datos de archivos usando la API de Claude
   * @param files Lista de archivos a procesar
   * @param userId ID del usuario para logging
   * @returns Datos extraídos en formato JSON
   */
  async extractDataFromFiles(
    files: Express.Multer.File[],
    userId: string
  ): Promise<ExtractionResult> {
    try {
      // Validar y procesar archivos
      const validation = this.validateFiles(files);

      if (!validation.valid) {
        return {
          status: StatusCodes.BAD_REQUEST,
          message: validation.message!,
        };
      }

      const processedData = await processFilesForClaude(files);
      console.log(
        `Archivos procesados para usuario ${userId}:`,
        processedData.stats
      );

      // Obtener categorías del usuario
      const categories: Category[] = await this.prisma.category.findMany({
        where: { userId: userId },
        orderBy: {
          createdAt: "desc",
        },
      });

      // Crear mensaje usando los archivos procesados
      const messages: Message[] = [
        {
          role: "user",
          content: [],
        },
      ];

      // Convertir el contenido procesado al formato de mensaje
      processedData.claudeContent.forEach((content) => {
        messages[0].content.push({
          type: content.type,
          source: {
            type: "base64",
            media_type: content.source.media_type,
            data: content.source.data,
          },
        });
      });

      // Crear lista de categorías en texto legible
      const categoryList = categories
        .map((cat) => `- ${cat.name}: ID=${cat.id}`)
        .join("\n");

      // Agregar instrucciones al prompt
      const systemPrompt = `Eres un experto en extracción y clasificación de datos de facturas. Extraerás datos clave y asignarás la categoría más adecuada del gasto según una lista.

INSTRUCCIONES:
1. Analiza las imágenes y documentos proporcionados buscando facturas o recibos.
2. Extrae: fecha, monto total, descripción corta, nombre del negocio.
3. Asigna la categoría más apropiada del gasto con base en su descripción, tipo de compra y establecimiento.

LISTA DE CATEGORÍAS DISPONIBLES:
${categoryList}

FORMATO DE RESPUESTA (SOLO JSON válido):

✅ CASO EXITOSO:
{
"date": "YYYY-MM-DDTHH:mm:ss.sssZ",
"totalAmount": 0.00,
"info": "Descripción breve",
"business": "Nombre del establecimiento",
"categoryId": "id-categoria-seleccionada"
}

❌ CASO DE ERROR:
{
"status": "error",
"message": "Descripción del problema"
}

REGLAS:
- Elige solo UNA categoría cuyo nombre se ajuste mejor al gasto.
- Usa exactamente el ID de la categoría (no su nombre).
- Si no puedes determinar una categoría adecuada, devuelve error.
- Si no se detecta un gasto válido, devuelve error.

IMPORTANTE: Responde SOLO con el JSON, sin texto adicional.
      `;

      console.log(
        `Enviando ${processedData.claudeContent.length} archivos a Claude para usuario ${userId}`
      );

      const msg = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        temperature: 0.1,
        system: systemPrompt,
        messages: messages as any,
      });

      const responseText =
        msg.content[0].type === "text" ? msg.content[0].text : "{}";
      const parsedResponse = JSON.parse(responseText);

      // Validación de respuesta
      if (parsedResponse.status === "error") {
        return parsedResponse as ErrorResponse;
      }

      if (
        !parsedResponse.date ||
        !parsedResponse.totalAmount ||
        !parsedResponse.categoryId
      ) {
        throw new Error("Respuesta incompleta: faltan campos requeridos");
      }

      return parsedResponse as ExtractedData;
    } catch (error: any) {
      console.error(`Error extrayendo datos para usuario ${userId}:`, error);

      // Si ya es un error estructurado, devolverlo
      if (error.status) return error;

      // Manejo específico de errores conocidos
      if (error.message?.includes("exceeds 5 MB maximum")) {
        return {
          status: StatusCodes.BAD_REQUEST,
          message: "Archivo excede el límite de tamaño permitido",
        };
      }

      if (error instanceof SyntaxError) {
        return {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          message: "Error procesando respuesta de Claude",
        };
      }

      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message || "Error desconocido al procesar archivos",
      };
    }
  }

  /**
   * Valida que los archivos sean del tipo correcto
   */
  validateFiles(files: Express.Multer.File[]): {
    valid: boolean;
    message?: string;
  } {
    if (!files?.length) {
      return { valid: false, message: "No se proporcionaron archivos" };
    }

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
      "application/pdf",
    ];

    for (const file of files) {
      if (!validTypes.includes(file.mimetype)) {
        return {
          valid: false,
          message: `Tipo de archivo no válido: ${file.mimetype}. Solo se permiten imágenes (JPEG, PNG, WebP, GIF) y PDFs`,
        };
      }
    }

    return { valid: true };
  }

  /**
   * Método para verificar el estado de la API de Claude
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 10,
        messages: [
          {
            role: "user",
            content: [{ type: "text", text: "Hello" }],
          },
        ],
      });

      return response.content.length > 0;
    } catch (error) {
      console.error("Claude API health check failed:", error);
      return false;
    }
  }
}
