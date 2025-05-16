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
exports.AuthController = void 0;
const http_status_codes_1 = require("http-status-codes");
const auth_util_1 = require("../../utils/auth/auth.util");
const auth_service_1 = require("../../services/auth/auth.service");
class AuthController {
    constructor() {
        this.usersAuthService = new auth_service_1.AuthService();
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const user = yield this.usersAuthService.login(req.body);
                if ((_a = user.preferences) === null || _a === void 0 ? void 0 : _a.twoFactor) {
                    const otpCode = yield auth_util_1.AuthUtil.generateOTP();
                    yield this.usersAuthService.sendVerificationOTPCode({
                        email: user.email,
                        OTPCode: otpCode,
                    });
                    res.status(http_status_codes_1.StatusCodes.OK).json({
                        status: http_status_codes_1.StatusCodes.OK,
                        body: {
                            message: "OTP code sent to your email",
                        },
                    });
                }
                else {
                    const token = yield auth_util_1.AuthUtil.generateToken(user);
                    res.status(http_status_codes_1.StatusCodes.OK).json({
                        status: http_status_codes_1.StatusCodes.OK,
                        body: {
                            message: "Login successful",
                            token: token,
                            user: user,
                        },
                    });
                }
            }
            catch (error) {
                console.log("Error in login: ", error);
                res.status(error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    body: {
                        error: {
                            message: error.message || "Server error while logging in",
                        },
                    },
                });
            }
        });
    }
    sendResetPasswordEmail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const result = yield this.usersAuthService.forgotPassword(email);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    body: {
                        message: result.message,
                    },
                });
            }
            catch (error) {
                console.log("Error in sendResetPasswordEmail: ", error);
                res.status(error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    body: {
                        error: {
                            message: error.message || "Server error while sending email",
                        },
                    },
                });
            }
        });
    }
    resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.usersAuthService.resetPassword(req.body);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    body: {
                        message: "Password reset successful",
                    },
                });
            }
            catch (error) {
                console.log("Error in resetPassword: ", error);
                res.status(error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    body: {
                        error: {
                            message: error.message || "Server error while resetting password",
                        },
                    },
                });
            }
        });
    }
    verifyOTPCode(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.usersAuthService.verifyOTPCode(req.body);
                const token = yield auth_util_1.AuthUtil.generateToken(user);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    body: {
                        message: "Login successfully",
                        token: token,
                        user: user,
                    },
                });
            }
            catch (error) {
                console.log("Error in verifyOTPCode: ", error);
                res.status(error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    body: {
                        error: {
                            message: error.message || "Server error while verifying OTP code to login",
                        },
                    },
                });
            }
        });
    }
}
exports.AuthController = AuthController;
