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
const validation_session_middleware_1 = require("../../middlewares/validation-session.middleware");
const validation_schema_middleware_1 = require("../../middlewares/validation-schema.middleware");
const expenses_schema_1 = require("../../schemas/expenses.schema");
const expenses_controller_1 = require("../../controllers/expenses/expenses.controller");
const expensesRouter = (0, express_1.Router)();
const expensesController = new expenses_controller_1.ExpensesController();
expensesRouter.get("/", validation_session_middleware_1.validateSession, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return expensesController.getExpenses(req, res, next); }));
expensesRouter.post("/", validation_session_middleware_1.validateSession, (0, validation_schema_middleware_1.validateData)(expenses_schema_1.ExpenseCreateSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return expensesController.createExpense(req, res, next); }));
expensesRouter.get("/expense/:id", validation_session_middleware_1.validateSession, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return expensesController.getExpenseById(req, res, next); }));
expensesRouter.patch("/expense/:id", validation_session_middleware_1.validateSession, (0, validation_schema_middleware_1.validateData)(expenses_schema_1.ExpenseUpdateSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return expensesController.updateExpense(req, res, next); }));
expensesRouter.delete("/expense/:id", validation_session_middleware_1.validateSession, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return expensesController.deleteExpense(req, res, next); }));
exports.default = expensesRouter;
