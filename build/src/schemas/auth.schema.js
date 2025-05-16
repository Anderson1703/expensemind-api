"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserOTPVerificationSchema = exports.UserResetPasswordSchema = exports.UserForgotPasswordSchema = exports.UserLoginSchema = void 0;
const zod_1 = require("zod");
exports.UserLoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
exports.UserForgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
});
exports.UserResetPasswordSchema = zod_1.z.object({
    password: zod_1.z.string().min(8),
    token: zod_1.z.string(),
});
exports.UserOTPVerificationSchema = zod_1.z.object({
    OTPCode: zod_1.z.string().min(5),
    email: zod_1.z.string().email(),
});
