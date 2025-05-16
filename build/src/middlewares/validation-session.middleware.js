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
exports.validateSession = void 0;
const http_status_codes_1 = require("http-status-codes");
const auth_util_1 = require("../utils/auth/auth.util");
// validateSession middleware
const validateSession = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers["x-access-token"];
        if (!token) {
            throw {
                message: "Token not sent",
            };
        }
        const decoded = yield auth_util_1.AuthUtil.verifyToken(token);
        if (!decoded.isValid) {
            throw {
                message: "Token is invalid",
            };
        }
        req.current_user = decoded.data;
        next();
    }
    catch (error) {
        console.error("Error en validateSession:", error);
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            status: http_status_codes_1.StatusCodes.UNAUTHORIZED,
            body: {
                error: {
                    message: error.message || "Invalid session",
                },
            },
        });
    }
});
exports.validateSession = validateSession;
