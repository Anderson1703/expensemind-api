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
const express_1 = require("express");
const validation_schema_middleware_1 = require("../../middlewares/validation-schema.middleware");
const validation_session_middleware_1 = require("../../middlewares/validation-session.middleware");
const users_controller_1 = require("../../controllers/users/users.controller");
const users_schema_1 = require("../../schemas/users.schema");
const usersRouter = (0, express_1.Router)();
const usersController = new users_controller_1.UsersController();
usersRouter.get("/", validation_session_middleware_1.validateSession, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return yield usersController.getUsers(req, res, next); }));
usersRouter.get("/load-data", validation_session_middleware_1.validateSession, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return usersController.loadData(req, res, next); }));
usersRouter.get("/payment-history", validation_session_middleware_1.validateSession, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return yield usersController.getPaymentHistory(req, res, next); }));
usersRouter.get("/user/:id", validation_session_middleware_1.validateSession, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return yield usersController.getUserById(req, res, next); }));
usersRouter.get("/user-by-token", validation_session_middleware_1.validateSession, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return yield usersController.getUserByToken(req, res, next); }));
usersRouter.get("/email/:email", validation_session_middleware_1.validateSession, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return yield usersController.getUserByEmail(req, res, next); }));
usersRouter.patch("/user/:id", validation_session_middleware_1.validateSession, (0, validation_schema_middleware_1.validateData)(users_schema_1.UserUpdateSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return yield usersController.updateUser(req, res, next); }));
usersRouter.delete("/user/:id", validation_session_middleware_1.validateSession, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return yield usersController.deleteUser(req, res, next); }));
usersRouter.post("/user/change-password", validation_session_middleware_1.validateSession, (0, validation_schema_middleware_1.validateData)(users_schema_1.UserChangePasswordSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return yield usersController.changeUserPassword(req, res, next); }));
exports.default = usersRouter;
