"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateData = void 0;
const zod_1 = require("zod");
const http_status_codes_1 = require("http-status-codes");
const validateData = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            const parsed = schema.safeParse(req.body);
            if (!parsed.success) {
                throw {
                    status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: "Invalid body"
                };
            }
            if (Object.keys(parsed.data).length === 0) {
                throw {
                    status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: 'Body is required'
                };
            }
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.errors.map((issue) => ({
                    message: `${issue.path.join('.')} is ${issue.message}`,
                }));
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: 'Invalid data',
                    details: errorMessages
                });
            }
            else {
                res.status(error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    message: error.message || 'Server error'
                });
            }
        }
    };
};
exports.validateData = validateData;
