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
exports.AuthService = void 0;
const client_1 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
const mail_util_1 = require("../../utils/mail/mail.util");
const auth_util_1 = require("../../utils/auth/auth.util");
class AuthService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
        this.mailUtil = new mail_util_1.MailUtil();
    }
    login(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, password }) {
            const user = yield this.prisma.user.findUnique({
                where: { email: email },
                include: {
                    preferences: true,
                    subscriptions: {
                        include: {
                            plan: true,
                        },
                    },
                    categories: true,
                },
            });
            if (!user) {
                throw {
                    message: "Invalid credentials",
                    status: http_status_codes_1.StatusCodes.NOT_FOUND,
                };
            }
            const isValidPassword = yield auth_util_1.AuthUtil.comparePassword(password, user.password);
            if (!isValidPassword) {
                throw {
                    message: "Invalid credentials",
                    status: http_status_codes_1.StatusCodes.UNAUTHORIZED,
                };
            }
            return user;
        });
    }
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.$transaction((tsx) => __awaiter(this, void 0, void 0, function* () {
                const user = yield tsx.user.findUnique({
                    where: { email: email },
                });
                if (!user) {
                    throw {
                        message: "User not found",
                        status: http_status_codes_1.StatusCodes.NOT_FOUND,
                    };
                }
                const token = yield auth_util_1.AuthUtil.generateRandomString(32);
                yield tsx.recovery.create({
                    data: {
                        email: user.email,
                        token,
                        expiration: new Date(Date.now() + 5 * 60 * 1000),
                    },
                });
                const result = yield this.mailUtil.sendResetPasswordMail({
                    to: user.email,
                    token: token,
                });
                if (result.error) {
                    throw {
                        message: result.message,
                        status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    };
                }
                return result;
            }));
        });
    }
    resetPassword(_a) {
        return __awaiter(this, arguments, void 0, function* ({ password, token, }) {
            return yield this.prisma.$transaction((tsx) => __awaiter(this, void 0, void 0, function* () {
                const recovery = yield tsx.recovery.findUnique({
                    where: { token: token },
                });
                if (!recovery) {
                    throw {
                        message: "Invalid token",
                        status: http_status_codes_1.StatusCodes.UNAUTHORIZED,
                    };
                }
                if (new Date() > recovery.expiration) {
                    throw {
                        message: "Token expired",
                        status: http_status_codes_1.StatusCodes.UNAUTHORIZED,
                    };
                }
                const user = yield tsx.user.findUnique({
                    where: { email: recovery.email },
                });
                if (!user) {
                    throw {
                        message: "User not found",
                        status: http_status_codes_1.StatusCodes.NOT_FOUND,
                    };
                }
                const hashedPassword = yield auth_util_1.AuthUtil.hashPassword(password);
                yield tsx.user.update({
                    where: { email: recovery.email },
                    data: { password: hashedPassword },
                });
                yield tsx.recovery.delete({
                    where: { token: token },
                });
                return user;
            }));
        });
    }
    sendVerificationOTPCode(_a) {
        return __awaiter(this, arguments, void 0, function* ({ OTPCode, email, }) {
            return yield this.prisma.$transaction((tsx) => __awaiter(this, void 0, void 0, function* () {
                const user = yield tsx.user.findUnique({
                    where: { email: email },
                });
                if (!user) {
                    throw {
                        message: "User not found",
                        status: http_status_codes_1.StatusCodes.NOT_FOUND,
                    };
                }
                yield tsx.otps.create({
                    data: {
                        email: user.email,
                        otp: OTPCode,
                        expiration: new Date(Date.now() + 5 * 60 * 1000),
                    },
                });
                const result = yield this.mailUtil.sendOTPCode({
                    to: email,
                    otp: OTPCode,
                });
                if (result.error) {
                    throw {
                        message: result.message,
                        status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    };
                }
                return result;
            }));
        });
    }
    verifyOTPCode(_a) {
        return __awaiter(this, arguments, void 0, function* ({ OTPCode, email }) {
            return yield this.prisma.$transaction((tsx) => __awaiter(this, void 0, void 0, function* () {
                const otpRecord = yield tsx.otps.findUnique({
                    where: {
                        otp: OTPCode,
                        email: email,
                    },
                });
                if (!otpRecord) {
                    throw {
                        message: "Already used OTP code or invalid OTP code",
                        status: http_status_codes_1.StatusCodes.UNAUTHORIZED,
                    };
                }
                if (new Date() > otpRecord.expiration) {
                    throw {
                        message: "OTP code expired",
                        status: http_status_codes_1.StatusCodes.UNAUTHORIZED,
                    };
                }
                const user = yield tsx.user.findUnique({
                    where: { email: email },
                });
                if (!user) {
                    throw {
                        message: "User not found",
                        status: http_status_codes_1.StatusCodes.NOT_FOUND,
                    };
                }
                yield tsx.user.update({
                    where: {
                        email: email,
                    },
                    data: {
                        updatedAt: new Date(),
                    },
                });
                yield tsx.otps.delete({
                    where: {
                        otp: OTPCode,
                    },
                });
                const userResponse = yield this.prisma.user.findUnique({
                    where: { email: email },
                    include: {
                        preferences: true,
                        subscriptions: {
                            include: {
                                plan: true,
                            },
                        },
                    },
                });
                if (!userResponse) {
                    throw {
                        message: "User not found",
                        status: http_status_codes_1.StatusCodes.NOT_FOUND,
                    };
                }
                return userResponse;
            }));
        });
    }
}
exports.AuthService = AuthService;
