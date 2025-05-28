"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClaudeService = void 0;
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const client_1 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
const anthropic = new sdk_1.default({
    apiKey: process.env.ANTHROPIC_API_KEY,
});
class ClaudeService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    /**
     * Extrae datos de archivos usando la API de Claude
     * @param files Lista de archivos a procesar
     * @param userId ID del usuario para logging
     * @returns Datos extraídos en formato JSON
     */
    extractDataFromFiles(files, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield this.prisma.category.findMany({
                    where: { userId: userId },
                    orderBy: {
                        createdAt: "desc",
                    },
                });
                const messages = [
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
                const msg = yield anthropic.messages
                    .create({
                    model: "claude-sonnet-4-20250514",
                    max_tokens: 1000,
                    temperature: 0.1, // Temperatura baja para mayor consistencia
                    system: systemPrompt,
                    messages: messages,
                })
                    .catch((error) => {
                    console.error("Error al enviar el mensaje a Claude:", error);
                    throw {
                        status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                        message: "Error al procesar la solicitud con Claude",
                    };
                });
                const responseText = msg.content[0].type === "text" ? msg.content[0].text : "{}";
                try {
                    const parsedResponse = JSON.parse(responseText);
                    // Validación básica de la respuesta
                    if (parsedResponse.status === "error") {
                        return parsedResponse;
                    }
                    // Validar que tenga los campos requeridos
                    if (!parsedResponse.hasOwnProperty("date") ||
                        !parsedResponse.hasOwnProperty("totalAmount") ||
                        !parsedResponse.hasOwnProperty("categoryId")) {
                        throw new Error("Respuesta incompleta: faltan campos requeridos");
                    }
                    return parsedResponse;
                }
                catch (parseError) {
                    throw new Error("Error al procesar la respuesta del análisis");
                }
            }
            catch (error) {
                console.error(`Error al extraer datos de archivos para usuario ${userId}:`, error);
                throw {
                    status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    message: error.message || "Error desconocido al procesar archivos",
                };
            }
        });
    }
    /**
     * Método auxiliar para validar si un archivo es una imagen válida
     */
    isValidImageFile(file) {
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
    isValidDocumentFile(file) {
        const validDocumentTypes = ["application/pdf"];
        return validDocumentTypes.includes(file.mimetype);
    }
    /**
     * Valida que los archivos sean del tipo correcto antes de procesarlos
     */
    validateFiles(files) {
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
exports.ClaudeService = ClaudeService;
