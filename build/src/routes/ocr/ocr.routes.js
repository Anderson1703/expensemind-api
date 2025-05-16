"use strict";
// // src/routes/ocr.routes.ts
// import { Router } from 'express';
// import { validateSession } from '../../middlewares/validation-session.middleware';
// import { OcrController } from '../../controllers/ocr/ocr.controller';
// const router = Router();
// const ocrController = new OcrController();
// // Ruta para extraer datos de archivos
// // Primero se ejecuta el middleware de autenticación
// // Luego el middleware para procesar la subida de archivos
// // Si hay error en la subida, se captura con handleMulterError
// // Finalmente se ejecuta el método extractData
// router.post(
//   '/extract',
//   validateSession,
//   ocrController.uploadFiles,
//   ocrController.handleMulterError,
//   ocrController.extractData.bind(ocrController)
// );
// export default router;
