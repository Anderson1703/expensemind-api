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
exports.OcrController = void 0;
const http_status_codes_1 = require("http-status-codes");
const claude_service_1 = require("../../services/claude/claude.service");
const multer_1 = __importDefault(require("multer"));
const multer_2 = require("multer");
// Configuración de multer para almacenar archivos en memoria
const storage = multer_1.default.memoryStorage();
// Función para filtrar tipos de archivos permitidos (imágenes y PDFs)
const fileFilter = (req, file, cb) => {
    // Aceptar solo imágenes y PDFs
    if (file.mimetype === "image/jpeg" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/webp" ||
        file.mimetype === "application/pdf") {
        cb(null, true);
    }
    else {
        cb(new Error("Formato de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, GIF) y PDFs."));
    }
};
// Configurar multer con opciones
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // Límite de 5MB por archivo
    },
});
class OcrController {
    constructor() {
        // Middleware para procesar la subida de archivos
        this.uploadFiles = upload.array("files", 10);
        // Método para manejar errores de multer
        this.handleMulterError = (err, req, res, next) => {
            if (err instanceof multer_2.MulterError) {
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    body: {
                        error: {
                            message: `Error al procesar archivos: ${err.message}`,
                        },
                    },
                });
            }
            else if (err) {
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    body: {
                        error: {
                            message: err.message || "Error desconocido al procesar archivos",
                        },
                    },
                });
            }
            next();
        };
        this.claudeService = new claude_service_1.ClaudeService();
    }
    // Método principal para extraer datos
    extractData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.current_user.id;
                // Verificar que hay archivos
                if (!req.files || !req.files.length) {
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                        status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                        body: {
                            error: {
                                message: "No se han proporcionado archivos para procesar",
                            },
                        },
                    });
                }
                // Obtener los archivos del request
                const files = req.files;
                // Preparar información básica de archivos para logging
                const filesInfo = files.map((file) => ({
                    originalName: file.originalname,
                    size: file.size,
                    mimetype: file.mimetype,
                }));
                console.log(`Procesando ${files.length} archivos para el usuario ${userId}:`, filesInfo);
                // Llamar al servicio de Claude para extraer datos
                const extractedData = yield this.claudeService.extractDataFromFiles(files, userId);
                // Responder con los datos extraídos
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    body: {
                        message: `${files.length} archivo(s) procesado(s) correctamente`,
                        data: extractedData,
                    },
                });
            }
            catch (error) {
                console.log("Error in extractData: ", error);
                res.status(error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    body: {
                        error: {
                            message: error.message || "Server error while extracting data",
                        },
                    },
                });
            }
        });
    }
}
exports.OcrController = OcrController;
