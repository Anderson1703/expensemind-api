"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = void 0;
const zod_1 = require("zod");
exports.Status = zod_1.z.enum(['CREATED', 'UPDATED', 'DELETED']);
