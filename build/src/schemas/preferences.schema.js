"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreferenceUpdateSchema = exports.PreferenceCreateSchema = void 0;
const zod_1 = require("zod");
exports.PreferenceCreateSchema = zod_1.z.object({
    theme: zod_1.z.enum(["LIGHT", "DARK"]),
    language: zod_1.z.enum(["EN", "ES"]),
    twoFactor: zod_1.z.boolean(),
});
exports.PreferenceUpdateSchema = zod_1.z.object({
    theme: zod_1.z.enum(["LIGHT", "DARK"]).optional(),
    language: zod_1.z.enum(["EN", "ES"]).optional(),
    twoFactor: zod_1.z.boolean().optional(),
});
