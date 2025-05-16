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
exports.UsersService = void 0;
const client_1 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
const auth_util_1 = require("../../utils/auth/auth.util");
class UsersService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.user.findMany({});
        });
    }
    loadData(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.prisma.user.findUnique({
                where: { id: userId },
                include: {
                    categories: true,
                    expenses: true,
                },
            });
            if (!user) {
                throw {
                    message: "User not found",
                    status: http_status_codes_1.StatusCodes.NOT_FOUND,
                };
            }
            return user;
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.prisma.user.findUnique({
                where: { id: id },
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
                    message: "User not found",
                    status: http_status_codes_1.StatusCodes.NOT_FOUND,
                };
            }
            return user;
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.prisma.user.findUnique({
                where: { email: email },
            });
            if (!user) {
                throw {
                    message: "User not found",
                    status: http_status_codes_1.StatusCodes.NOT_FOUND,
                };
            }
            return user;
        });
    }
    updateUser(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getUserById(id);
            yield this.prisma.user.update({
                where: { id: id },
                data: user,
            });
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getUserById(id);
            yield this.prisma.user.delete({
                where: { id: id },
            });
        });
    }
    changeUserPassword(id, currentPassword, newPasswor) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUserById(id);
            const isPasswordValid = yield auth_util_1.AuthUtil.comparePassword(currentPassword, user.password);
            if (!isPasswordValid) {
                throw {
                    message: "Invalid password",
                    status: http_status_codes_1.StatusCodes.UNAUTHORIZED,
                };
            }
            if (currentPassword === newPasswor) {
                throw {
                    message: "New password cannot be the same as the current password",
                    status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                };
            }
            const passwordHashed = yield auth_util_1.AuthUtil.hashPassword(newPasswor);
            yield this.prisma.user.update({
                where: { id: id },
                data: { password: passwordHashed },
            });
        });
    }
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordHashed = yield auth_util_1.AuthUtil.hashPassword(data.password);
            const plan = yield this.prisma.plan.findUnique({
                where: { id: data.planId },
            });
            if (!plan) {
                throw {
                    message: "Plan not found",
                    status: http_status_codes_1.StatusCodes.NOT_FOUND,
                };
            }
            yield this.prisma.user.create({
                data: {
                    email: data.email,
                    name: data.name,
                    last_name: data.last_name,
                    password: passwordHashed,
                    preferences: {
                        create: {
                            language: client_1.Language.EN,
                            theme: client_1.Theme.LIGHT,
                            twoFactor: true,
                        },
                    },
                    subscriptions: {
                        create: [
                            {
                                planId: plan.id,
                                startDate: new Date(),
                            },
                        ],
                    },
                },
            });
        });
    }
}
exports.UsersService = UsersService;
