"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseUpdateSchema = exports.ExpenseCreateSchema = void 0;
const zod_1 = require("zod");
exports.ExpenseCreateSchema = zod_1.z.object({
    categoryId: zod_1.z.string(),
    date: zod_1.z.string().transform((date) => new Date(date)),
    uploadedWithFile: zod_1.z.boolean(),
    totalAmount: zod_1.z.number(),
    info: zod_1.z.string().optional(),
    business: zod_1.z.string().optional(),
});
exports.ExpenseUpdateSchema = zod_1.z.object({
    date: zod_1.z
        .string()
        .transform((date) => new Date(date))
        .optional(),
    totalAmount: zod_1.z.number().optional(),
    info: zod_1.z.string().optional(),
    business: zod_1.z.string().optional(),
});
