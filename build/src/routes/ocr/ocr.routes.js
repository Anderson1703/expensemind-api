"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_session_middleware_1 = require("../../middlewares/validation-session.middleware");
const ocr_controller_1 = require("../../controllers/ocr/ocr.controller");
const ocrRouter = (0, express_1.Router)();
const ocrController = new ocr_controller_1.OcrController();
// Ruta para extraer datos de archivos
// Primero se ejecuta el middleware de autenticación
// Luego el middleware para procesar la subida de archivos
// Si hay error en la subida, se captura con handleMulterError
// Finalmente se ejecuta el método extractData
ocrRouter.post('/extract', validation_session_middleware_1.validateSession, ocrController.uploadFiles, ocrController.handleMulterError, ocrController.extractData.bind(ocrController));
exports.default = ocrRouter;
