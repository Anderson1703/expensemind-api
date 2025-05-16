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
exports.ExpensesController = void 0;
const http_status_codes_1 = require("http-status-codes");
const expenses_service_1 = require("../../services/expenses/expenses.service");
class ExpensesController {
    constructor() {
        this.expensesService = new expenses_service_1.ExpensesService();
    }
    getExpenses(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.current_user.id;
                const expenses = yield this.expensesService.getExpenses(userId);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    body: expenses,
                });
            }
            catch (error) {
                console.log("Error in getExpenses: ", error);
                res.status(error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    body: {
                        error: {
                            message: error.message || "Server error while fetching expenses",
                        },
                    },
                });
            }
        });
    }
    getExpenseById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const expense = yield this.expensesService.getExpenseById(id);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    body: expense,
                });
            }
            catch (error) {
                console.log("Error in getExpenseById: ", error);
                res.status(error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    body: {
                        error: {
                            message: error.message || "Server error while fetching expense",
                        },
                    },
                });
            }
        });
    }
    createExpense(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.current_user.id;
                const expense = req.body;
                const createdExpense = yield this.expensesService.createExpense(expense, userId);
                res.status(http_status_codes_1.StatusCodes.CREATED).json({
                    status: http_status_codes_1.StatusCodes.CREATED,
                    body: createdExpense,
                });
            }
            catch (error) {
                console.log("Error in createExpense: ", error);
                res.status(error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    body: {
                        error: {
                            message: error.message || "Server error while creating expense",
                        },
                    },
                });
            }
        });
    }
    updateExpense(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const expense = req.body;
                const updatedExpense = yield this.expensesService.updateExpense(id, expense);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    body: updatedExpense,
                });
            }
            catch (error) {
                console.log("Error in updateExpense: ", error);
                res.status(error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    body: {
                        error: {
                            message: error.message || "Server error while updating expense",
                        },
                    },
                });
            }
        });
    }
    deleteExpense(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield this.expensesService.deleteExpense(id);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    body: {
                        message: "Expense deleted successfully",
                    },
                });
            }
            catch (error) {
                console.log("Error in deleteExpense: ", error);
                res.status(error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    body: {
                        error: {
                            message: error.message || "Server error while deleting expense",
                        },
                    },
                });
            }
        });
    }
}
exports.ExpensesController = ExpensesController;
