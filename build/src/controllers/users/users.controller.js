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
exports.UsersController = void 0;
const http_status_codes_1 = require("http-status-codes");
const users_service_1 = require("../../services/users/users.service");
class UsersController {
    constructor() {
        this.usersService = new users_service_1.UsersService();
    }
    validateId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw {
                    message: "User id is required",
                    status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                };
            }
            if (typeof id !== "string" || id.length < 5) {
                throw {
                    message: "Invalid user id",
                    status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                };
            }
        });
    }
    validateEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email) {
                throw {
                    message: "User email is required",
                    status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                };
            }
            if (typeof email !== "string" ||
                !email.includes("@") ||
                !email.includes(".") ||
                email.length < 5) {
                throw {
                    message: "Invalid user email",
                    status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                };
            }
        });
    }
    getUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.usersService.getUsers();
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    body: users,
                });
            }
            catch (error) {
                console.log("Error in getUsers: ", error);
                res.status(error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    body: {
                        error: {
                            message: error.message || "Server error while fetching users",
                        },
                    },
                });
            }
        });
    }
    loadData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const current_user = req.current_user;
                const users = yield this.usersService.loadData(current_user.id);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    body: {
                        expenses: users.expenses,
                        categories: users.categories,
                    },
                });
            }
            catch (error) {
                console.log("Error in loadData: ", error);
                res.status(error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    body: {
                        error: {
                            message: error.message || "Server error while loading data",
                        },
                    },
                });
            }
        });
    }
    getUserById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield this.validateId(id);
                const user = yield this.usersService.getUserById(id);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    body: user,
                });
            }
            catch (error) {
                console.log("Error in getUserById: ", error);
                res.status(error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    body: {
                        error: {
                            message: error.message || "Server error while fetching user",
                        },
                    },
                });
            }
        });
    }
    getUserByToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            debugger;
            try {
                const current_user = req.current_user;
                yield this.validateId(current_user.id);
                const user = yield this.usersService.getUserById(current_user.id);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    body: user,
                });
            }
            catch (error) {
                console.log("Error in getUserByToken: ", error);
                res.status(error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    body: {
                        error: {
                            message: error.message || "Server error while fetching user",
                        },
                    },
                });
            }
        });
    }
    getUserByEmail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.params;
                yield this.validateEmail(email);
                const user = yield this.usersService.getUserByEmail(email);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    body: user,
                });
            }
            catch (error) {
                console.log("Error in getUserByEmail: ", error);
                res.status(error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    body: {
                        error: {
                            message: error.message || "Server error while fetching user",
                        },
                    },
                });
            }
        });
    }
    getPaymentHistory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const current_user = req.current_user;
                const paymentHistory = yield this.usersService.getPaymentHistory(current_user.id);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    body: paymentHistory,
                });
            }
            catch (error) {
                console.log("Error in getPaymentHistory: ", error);
                res.status(error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    body: {
                        error: {
                            message: error.message || "Server error while fetching payment history",
                        },
                    },
                });
            }
        });
    }
    updateUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield this.validateId(id);
                yield this.usersService.updateUser(id, req.body);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    body: {
                        message: "User updated successfully",
                    },
                });
            }
            catch (error) {
                console.log("Error in updateUser: ", error);
                res.status(error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    body: {
                        error: {
                            message: error.message || "Server error while updating user",
                        },
                    },
                });
            }
        });
    }
    deleteUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield this.validateId(id);
                yield this.usersService.deleteUser(id);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    body: {
                        message: "User deleted successfully",
                    },
                });
            }
            catch (error) {
                console.log("Error in deleteUser: ", error);
                res.status(error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    body: {
                        error: {
                            message: error.message || "Server error while deleting user",
                        },
                    },
                });
            }
        });
    }
    createUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.usersService.createUser(req.body);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    body: {
                        message: "User created successfully",
                    },
                });
            }
            catch (error) {
                console.log("Error in createUser: ", error);
                res.status(error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    body: {
                        error: {
                            message: error.message || "Server error",
                        },
                    },
                });
            }
        });
    }
    changeUserPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.current_user.id;
                const { currentPassword, newPassword } = req.body;
                yield this.usersService.changeUserPassword(userId, currentPassword, newPassword);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    body: {
                        message: "User password changed successfully",
                    },
                });
            }
            catch (error) {
                console.log("Error in changeUserPassword: ", error);
                res.status(error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    body: {
                        error: {
                            message: error.message || "Server error while changing user password",
                        },
                    },
                });
            }
        });
    }
}
exports.UsersController = UsersController;
