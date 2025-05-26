import Anthropic from "@anthropic-ai/sdk";

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
  date: string; // DateTime en formato ISO
  totalAmount: number; // Float
  info?: string; // Descripción opcional
  business?: string; // Nombre del negocio opcional
}

interface ErrorResponse {
  status: "error";
  message: string;
}

type ExtractionResult = ExtractedData | ErrorResponse;

export class ClaudeService {
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

      const systemPrompt = `Eres un experto en extracción de datos de facturas y recibos. Tu tarea es analizar las imágenes proporcionadas y extraer información específica.

INSTRUCCIONES:
1. Analiza cuidadosamente cada imagen en busca de facturas, recibos o comprobantes
2. Extrae los datos requeridos con máxima precisión
3. Si los datos no son legibles o las imágenes no contienen facturas/recibos, devuelve un mensaje de error

FORMATO DE SALIDA REQUERIDO:
Siempre responde ÚNICAMENTE con un objeto JSON válido en uno de estos dos formatos:

CASO EXITOSO:
{
  "date": "YYYY-MM-DDTHH:mm:ss.sssZ",
  "totalAmount": 0.00,
  "info": "Descripción breve del tipo de compra",
  "business": "Nombre del establecimiento"
}

CASO DE ERROR:
{
  "status": "error",
  "message": "Descripción específica del problema"
}

REGLAS ESPECÍFICAS:
- date: Convertir a formato ISO 8601. Si no hay fecha, usar fecha actual
- totalAmount: Número decimal sin símbolos de moneda
- info: Descripción contextual breve (máximo 50 caracteres). Ejemplos:
  * "Compra en supermercado"
  * "Combustible gasolinera"
  * "Servicio de restaurante"
  * "Compra farmacia"
- business: Nombre exacto del establecimiento según aparece en el documento
- Si falta información crítica (monto total), devolver error
- Si la imagen no es clara o no contiene facturas/recibos, devolver error

EJEMPLOS DE RESPUESTAS:
✅ Correcto:
{
  "date": "2024-01-15T14:30:00.000Z",
  "totalAmount": 125.50,
  "info": "Compra en supermercado",
  "business": "Supermercado La Economía"
}

❌ Error:
{
  "status": "error",
  "message": "La imagen no contiene una factura o recibo legible"
}

IMPORTANTE: Responde SOLO con el JSON, sin texto adicional antes o después.`;

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
          !parsedResponse.hasOwnProperty("totalAmount")
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
