import { Router } from 'express';
import { validateSession } from '../../middlewares/validation-session.middleware';
import { OcrController } from '../../controllers/ocr/ocr.controller';
const ocrRouter = Router();
const ocrController = new OcrController();

ocrRouter.post(
  '/extract',
  validateSession,
  ocrController.uploadFiles,
  ocrController.handleMulterError,
  ocrController.extractData.bind(ocrController)
);

export default ocrRouter;