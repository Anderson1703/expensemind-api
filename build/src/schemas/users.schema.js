"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserChangePasswordSchema = exports.UserCreateSchema = exports.UserUpdateSchema = exports.UserResponseSchema = void 0;
const zod_1 = require("zod");
exports.UserResponseSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    last_name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    profile_picture: zod_1.z.string().optional().nullable(),
    createAt: zod_1.z.date(),
});
exports.UserUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    last_name: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    profile_picture: zod_1.z.string().optional().nullable(),
});
exports.UserCreateSchema = zod_1.z.object({
    planId: zod_1.z.string(),
    name: zod_1.z.string(),
    last_name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
exports.UserChangePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string(),
    newPassword: zod_1.z.string(),
});
