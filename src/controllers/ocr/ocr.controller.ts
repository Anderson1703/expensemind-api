import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { ClaudeService } from "../../services/claude/claude.service";
import multer from "multer";
import { MulterError } from "multer";

// Configuración de multer para almacenar archivos en memoria
const storage = multer.memoryStorage();

// Función para filtrar tipos de archivos permitidos (imágenes y PDFs)
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Aceptar solo imágenes y PDFs
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/webp" ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Formato de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, GIF) y PDFs."
      )
    );
  }
};

// Configurar multer con opciones
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Límite de 5MB por archivo
  },
});

export class OcrController {
  private claudeService: ClaudeService;

  constructor() {
    this.claudeService = new ClaudeService();
  }

  // Middleware para procesar la subida de archivos
  uploadFiles = upload.array("files", 10);

  // Método para manejar errores de multer
  handleMulterError = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (err instanceof MulterError) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        body: {
          error: {
            message: `Error al procesar archivos: ${err.message}`,
          },
        },
      });
    } else if (err) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        body: {
          error: {
            message: err.message || "Error desconocido al procesar archivos",
          },
        },
      });
    }
    next();
  };

  // Método principal para extraer datos
  async extractData(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).current_user.id;

      // Verificar que hay archivos
      if (!req.files || !(req.files as Express.Multer.File[]).length) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          body: {
            error: {
              message: "No se han proporcionado archivos para procesar",
            },
          },
        });
      }

      // Obtener los archivos del request
      const files = req.files as Express.Multer.File[];

      // Preparar información básica de archivos para logging
      const filesInfo = files.map((file) => ({
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      }));

      console.log(
        `Procesando ${files.length} archivos para el usuario ${userId}:`,
        filesInfo
      );

      // Llamar al servicio de Claude para extraer datos
      const extractedData = await this.claudeService.extractDataFromFiles(
        files,
        userId
      );

      // Responder con los datos extraídos
      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        body: {
          message: `${files.length} archivo(s) procesado(s) correctamente`,
          data: extractedData,
        },
      });
    } catch (error: any) {
      console.log("Error in extractData: ", error);
      res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          error: {
            message: error.message || "Server error while extracting data",
          },
        },
      });
    }
  }
}
