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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_session_middleware_1 = require("../../middlewares/validation-session.middleware");
const validation_schema_middleware_1 = require("../../middlewares/validation-schema.middleware");
const preferences_controller_1 = require("../../controllers/preferences/preferences.controller");
const preferences_schema_1 = require("../../schemas/preferences.schema");
const preferencesRouter = (0, express_1.Router)();
const preferencesController = new preferences_controller_1.PreferencesController();
preferencesRouter.get("/", validation_session_middleware_1.validateSession, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return preferencesController.getPreferences(req, res, next); }));
preferencesRouter.post("/", validation_session_middleware_1.validateSession, (0, validation_schema_middleware_1.validateData)(preferences_schema_1.PreferenceCreateSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return preferencesController.createPreference(req, res, next); }));
preferencesRouter.get("/preference/:id", validation_session_middleware_1.validateSession, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return preferencesController.getPreferenceById(req, res, next); }));
preferencesRouter.patch("/preference/:id", validation_session_middleware_1.validateSession, (0, validation_schema_middleware_1.validateData)(preferences_schema_1.PreferenceUpdateSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return preferencesController.updatePreference(req, res, next); }));
preferencesRouter.delete("/preference/:id", validation_session_middleware_1.validateSession, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return preferencesController.deletePreference(req, res, next); }));
exports.default = preferencesRouter;
