import Anthropic from "@anthropic-ai/sdk";
import { PrismaClient } from "@prisma/client";

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
  status: "error";
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
      const categories: Category[] = await this.prisma.category.findMany({
        where: { userId: userId },
        orderBy: {
          createdAt: "desc",
        },
      });

      const messages: Message[] = [
        {
          role: "user",
          content: [],
        },
      ];

      files.forEach((file) => {
        messages[0].content.push({
          type: file.mimetype.startsWith("image/") ? "image" : "document",
          source: {
            type: "base64",
            media_type: file.mimetype,
            data: file.buffer.toString("base64"),
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
1. Analiza las imágenes proporcionadas buscando facturas o recibos.
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

      const msg = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        temperature: 0.1, // Temperatura baja para mayor consistencia
        system: systemPrompt,
        messages: messages as any,
      });

      const responseText =
        msg.content[0].type === "text" ? msg.content[0].text : "{}";

      try {
        const parsedResponse = JSON.parse(responseText);

        // Validación básica de la respuesta
        if (parsedResponse.status === "error") {
          return parsedResponse as ErrorResponse;
        }

        // Validar que tenga los campos requeridos
        if (
          !parsedResponse.hasOwnProperty("date") ||
          !parsedResponse.hasOwnProperty("totalAmount") ||
          !parsedResponse.hasOwnProperty("categoryId")
        ) {
          return {
            status: "error",
            message: "Respuesta incompleta: faltan campos requeridos",
          };
        }

        return parsedResponse as ExtractedData;
      } catch (parseError) {
        console.error("Error al parsear respuesta JSON:", parseError);
        return {
          status: "error",
          message: "Error al procesar la respuesta del análisis",
        };
      }
    } catch (error) {
      console.error(
        `Error al extraer datos de archivos para usuario ${userId}:`,
        error
      );
      return {
        status: "error",
        message: "Error interno al procesar los archivos",
      };
    }
  }

  /**
   * Método auxiliar para validar si un archivo es una imagen válida
   */
  private isValidImageFile(file: Express.Multer.File): boolean {
    const validImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    return validImageTypes.includes(file.mimetype);
  }

  /**
   * Método auxiliar para validar si un archivo es un documento válido
   */
  private isValidDocumentFile(file: Express.Multer.File): boolean {
    const validDocumentTypes = ["application/pdf"];
    return validDocumentTypes.includes(file.mimetype);
  }

  /**
   * Valida que los archivos sean del tipo correcto antes de procesarlos
   */
  validateFiles(files: Express.Multer.File[]): {
    valid: boolean;
    message?: string;
  } {
    if (!files || files.length === 0) {
      return { valid: false, message: "No se proporcionaron archivos" };
    }

    for (const file of files) {
      if (!this.isValidImageFile(file) && !this.isValidDocumentFile(file)) {
        return {
          valid: false,
          message: `Tipo de archivo no válido: ${file.mimetype}. Solo se permiten imágenes (JPEG, PNG, WebP) y PDFs`,
        };
      }
    }

    return { valid: true };
  }
}
