"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanUpdateSchema = exports.PlanCreateSchema = void 0;
const zod_1 = require("zod");
exports.PlanCreateSchema = zod_1.z.object({
    planType: zod_1.z.enum(["FREE", "PREMIUM"]),
    price: zod_1.z.number(),
    dailyFilesLimit: zod_1.z.number(),
    categoryLimit: zod_1.z.number(),
    hasTemplates: zod_1.z.boolean(),
    autoEmailReports: zod_1.z.boolean(),
    allowedFormats: zod_1.z.array(zod_1.z.enum(["PDF", "CSV", "EXCEL"])),
});
exports.PlanUpdateSchema = zod_1.z.object({
    planType: zod_1.z.enum(["FREE", "PREMIUM"]).optional(),
    price: zod_1.z.number().optional(),
    dailyFilesLimit: zod_1.z.number().optional(),
    categoryLimit: zod_1.z.number().optional(),
    hasTemplates: zod_1.z.boolean().optional(),
    autoEmailReports: zod_1.z.boolean().optional(),
    allowedFormats: zod_1.z.array(zod_1.z.enum(["PDF", "CSV", "EXCEL"])).optional(),
});
