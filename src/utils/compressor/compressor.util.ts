import sharp from "sharp";
import { Buffer } from "buffer";

export interface FileInput {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
}

interface ProcessedFile {
  type: "image" | "document";
  base64: string;
  mimetype: string;
  originalSize: number;
  processedSize: number;
  filename: string;
}

interface ClaudeContent {
  type: "image" | "document";
  source: {
    type: "base64";
    media_type: string;
    data: string;
  };
}

class FileProcessor {
  private readonly MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB límite de Claude
  private readonly TARGET_SIZE_BYTES = 4.5 * 1024 * 1024; // Dejamos un margen

  // Tipos de archivo soportados
  private readonly IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  private readonly PDF_TYPES = ["application/pdf"];

  /**
   * Procesa un array de archivos (imágenes y PDFs)
   */
  async processFiles(files: FileInput[]): Promise<ProcessedFile[]> {
    const processedFiles: ProcessedFile[] = [];

    for (const file of files) {
      try {
        console.log(
          `Procesando archivo: ${file.originalname} (${file.mimetype})`
        );

        let processed: ProcessedFile;

        if (this.IMAGE_TYPES.includes(file.mimetype)) {
          processed = await this.processImage(file);
        } else if (this.PDF_TYPES.includes(file.mimetype)) {
          processed = await this.processPDF(file);
        } else {
          throw new Error(`Tipo de archivo no soportado: ${file.mimetype}`);
        }

        console.log(`Archivo procesado: ${file.originalname}`);
        console.log(
          `Tamaño original: ${(processed.originalSize / 1024 / 1024).toFixed(
            2
          )} MB`
        );
        console.log(
          `Tamaño procesado: ${(processed.processedSize / 1024 / 1024).toFixed(
            2
          )} MB`
        );

        if (processed.originalSize !== processed.processedSize) {
          console.log(
            `Reducción: ${(
              (1 - processed.processedSize / processed.originalSize) *
              100
            ).toFixed(1)}%`
          );
        }

        processedFiles.push(processed);
      } catch (error) {
        console.error(`Error procesando archivo ${file.originalname}:`, error);
        throw error;
      }
    }

    return processedFiles;
  }

  /**
   * Procesa una imagen y la comprime si es necesario
   */
  private async processImage(file: FileInput): Promise<ProcessedFile> {
    const originalSize = file.buffer.length;

    // Si ya está dentro del límite, solo convertir a base64
    if (originalSize <= this.TARGET_SIZE_BYTES) {
      return {
        type: "image",
        base64: file.buffer.toString("base64"),
        mimetype: file.mimetype,
        originalSize,
        processedSize: originalSize,
        filename: file.originalname,
      };
    }

    let compressedBuffer = file.buffer;
    let quality = 85;
    let width: number | undefined;
    let height: number | undefined;

    // Obtener dimensiones originales
    const metadata = await sharp(file.buffer).metadata();
    const originalWidth = metadata.width || 1920;
    const originalHeight = metadata.height || 1080;

    // Estrategia de compresión iterativa
    while (compressedBuffer.length > this.TARGET_SIZE_BYTES && quality > 10) {
      // Reducir calidad progresivamente
      if (quality > 50) {
        quality -= 15;
      } else {
        quality -= 10;
      }

      // Si aún es muy grande, reducir dimensiones
      if (compressedBuffer.length > this.TARGET_SIZE_BYTES && quality <= 30) {
        if (!width || !height) {
          width = Math.floor(originalWidth * 0.8);
          height = Math.floor(originalHeight * 0.8);
        } else {
          width = Math.floor(width * 0.9);
          height = Math.floor(height * 0.9);
        }
      }

      // Aplicar compresión
      compressedBuffer = await this.compressImage(
        file.buffer,
        file.mimetype,
        quality,
        width,
        height
      );
    }

    // Verificación final
    if (compressedBuffer.length > this.MAX_SIZE_BYTES) {
      throw new Error(
        `No se pudo comprimir la imagen ${file.originalname} por debajo de ${this.MAX_SIZE_BYTES} bytes`
      );
    }

    return {
      type: "image",
      base64: compressedBuffer.toString("base64"),
      mimetype: file.mimetype,
      originalSize,
      processedSize: compressedBuffer.length,
      filename: file.originalname,
    };
  }

  /**
   * Procesa un PDF
   */
  private async processPDF(file: FileInput): Promise<ProcessedFile> {
    const originalSize = file.buffer.length;

    // Verificar que el PDF no exceda el límite
    if (originalSize > this.MAX_SIZE_BYTES) {
      throw new Error(
        `El PDF ${file.originalname} excede el límite de ${this.MAX_SIZE_BYTES} bytes (${originalSize} bytes)`
      );
    }

    return {
      type: "document",
      base64: file.buffer.toString("base64"),
      mimetype: file.mimetype,
      originalSize,
      processedSize: originalSize,
      filename: file.originalname,
    };
  }

  /**
   * Aplica compresión a una imagen usando Sharp
   */
  private async compressImage(
    buffer: Buffer,
    mimetype: string,
    quality: number,
    width?: number,
    height?: number
  ): Promise<Buffer> {
    let sharpInstance = sharp(buffer);

    // Redimensionar si es necesario
    if (width && height) {
      sharpInstance = sharpInstance.resize(width, height, {
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    // Aplicar compresión según el tipo de imagen
    switch (mimetype) {
      case "image/jpeg":
      case "image/jpg":
        return sharpInstance.jpeg({ quality, progressive: true }).toBuffer();

      case "image/png":
        return sharpInstance
          .png({
            quality,
            compressionLevel: 9,
            adaptiveFiltering: true,
          })
          .toBuffer();

      case "image/webp":
        return sharpInstance.webp({ quality }).toBuffer();

      case "image/gif":
        // Para GIFs, convertir a PNG con compresión
        return sharpInstance
          .png({
            quality,
            compressionLevel: 9,
          })
          .toBuffer();

      default:
        // Convertir a JPEG por defecto para otros formatos
        return sharpInstance.jpeg({ quality, progressive: true }).toBuffer();
    }
  }

  /**
   * Convierte archivos procesados al formato requerido por Claude
   */
  convertToClaudeFormat(processedFiles: ProcessedFile[]): ClaudeContent[] {
    return processedFiles.map((file) => ({
      type: file.type,
      source: {
        type: "base64" as const,
        media_type: file.mimetype,
        data: file.base64,
      },
    }));
  }

  /**
   * Valida que los tipos de archivo sean soportados
   */
  validateFileTypes(files: FileInput[]): void {
    for (const file of files) {
      const isSupported = [...this.IMAGE_TYPES, ...this.PDF_TYPES].includes(
        file.mimetype
      );

      if (!isSupported) {
        throw new Error(
          `Tipo de archivo no soportado: ${
            file.mimetype
          }. Formatos soportados: ${[
            ...this.IMAGE_TYPES,
            ...this.PDF_TYPES,
          ].join(", ")}`
        );
      }
    }
  }

  /**
   * Obtiene estadísticas de procesamiento
   */
  getProcessingStats(processedFiles: ProcessedFile[]) {
    const totalOriginalSize = processedFiles.reduce(
      (acc, file) => acc + file.originalSize,
      0
    );
    const totalProcessedSize = processedFiles.reduce(
      (acc, file) => acc + file.processedSize,
      0
    );

    return {
      totalFiles: processedFiles.length,
      imageFiles: processedFiles.filter((f) => f.type === "image").length,
      pdfFiles: processedFiles.filter((f) => f.type === "document").length,
      totalOriginalSize,
      totalProcessedSize,
      totalReduction:
        totalOriginalSize > 0
          ? ((1 - totalProcessedSize / totalOriginalSize) * 100).toFixed(1) +
            "%"
          : "0%",
      files: processedFiles.map((file) => ({
        filename: file.filename,
        type: file.type,
        originalSize: `${(file.originalSize / 1024 / 1024).toFixed(2)} MB`,
        processedSize: `${(file.processedSize / 1024 / 1024).toFixed(2)} MB`,
        reduction:
          file.originalSize !== file.processedSize
            ? `${((1 - file.processedSize / file.originalSize) * 100).toFixed(
                1
              )}%`
            : "0%",
      })),
    };
  }
}

// Función principal para usar en tu servicio
export async function processFilesForClaude(
  files: Express.Multer.File[]
): Promise<{
  claudeContent: ClaudeContent[];
  stats: any;
}> {
  const processor = new FileProcessor();

  // Convertir archivos de Multer al formato interno
  const fileInputs: FileInput[] = files.map((file) => ({
    buffer: file.buffer,
    mimetype: file.mimetype,
    originalname: file.originalname,
    size: file.size,
  }));

  // Validar tipos de archivo
  processor.validateFileTypes(fileInputs);

  // Procesar archivos
  const processedFiles = await processor.processFiles(fileInputs);

  // Convertir al formato de Claude
  const claudeContent = processor.convertToClaudeFormat(processedFiles);

  // Obtener estadísticas
  const stats = processor.getProcessingStats(processedFiles);

  return {
    claudeContent,
    stats,
  };
}

export { FileProcessor, ProcessedFile, ClaudeContent };
