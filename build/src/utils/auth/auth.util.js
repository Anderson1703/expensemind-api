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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUtil = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = require("bcrypt");
const nanoid_1 = require("nanoid");
class AuthUtil {
    static verifyToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                return {
                    isValid: true,
                    data: decoded,
                };
            }
            catch (error) {
                return {
                    isValid: false,
                    data: null,
                };
            }
        });
    }
    static generateToken(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
        });
    }
    static hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, bcrypt_1.hashSync)(password, 10);
        });
    }
    static comparePassword(currentPassword, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, bcrypt_1.compareSync)(currentPassword, hashedPassword);
        });
    }
    static generateOTP() {
        return __awaiter(this, void 0, void 0, function* () {
            const nanoid = (0, nanoid_1.customAlphabet)("0123456789", 10);
            return nanoid(5);
        });
    }
    static generateRandomString(length) {
        return __awaiter(this, void 0, void 0, function* () {
            const nanoid = (0, nanoid_1.customAlphabet)("1234567890abcdef", 10);
            return nanoid(length).toLocaleUpperCase();
        });
    }
}
exports.AuthUtil = AuthUtil;
