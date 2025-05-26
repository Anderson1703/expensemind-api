import { Router } from 'express';
import { validateSession } from '../../middlewares/validation-session.middleware';
import { OcrController } from '../../controllers/ocr/ocr.controller';
const ocrRouter = Router();
const ocrController = new OcrController();

// Ruta para extraer datos de archivos
// Primero se ejecuta el middleware de autenticación
// Luego el middleware para procesar la subida de archivos
// Si hay error en la subida, se captura con handleMulterError
// Finalmente se ejecuta el método extractData
ocrRouter.post(
  '/extract',
  validateSession,
  ocrController.uploadFiles,
  ocrController.handleMulterError,
  ocrController.extractData.bind(ocrController)
);

export default ocrRouter;