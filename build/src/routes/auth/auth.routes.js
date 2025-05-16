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
const validation_schema_middleware_1 = require("../../middlewares/validation-schema.middleware");
const auth_controller_1 = require("../../controllers/auth/auth.controller");
const users_schema_1 = require("../../schemas/users.schema");
const users_controller_1 = require("../../controllers/users/users.controller");
const auth_schema_1 = require("../../schemas/auth.schema");
const authRouter = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
const usersController = new users_controller_1.UsersController();
authRouter.post("/login", (0, validation_schema_middleware_1.validateData)(auth_schema_1.UserLoginSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return yield authController.login(req, res, next); }));
authRouter.post("/register", (0, validation_schema_middleware_1.validateData)(users_schema_1.UserCreateSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return usersController.createUser(req, res, next); }));
authRouter.post("/forgot-password", (0, validation_schema_middleware_1.validateData)(auth_schema_1.UserForgotPasswordSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return authController.sendResetPasswordEmail(req, res, next); }));
authRouter.post("/reset-password", (0, validation_schema_middleware_1.validateData)(auth_schema_1.UserResetPasswordSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return authController.resetPassword(req, res, next); }));
authRouter.post("/verify-otp", (0, validation_schema_middleware_1.validateData)(auth_schema_1.UserOTPVerificationSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return authController.verifyOTPCode(req, res, next); }));
exports.default = authRouter;
