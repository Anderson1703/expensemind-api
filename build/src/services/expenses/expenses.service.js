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
exports.ExpensesService = void 0;
const client_1 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
class ExpensesService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    getExpenses(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.expense.findMany({
                where: { userId: userId },
                orderBy: {
                    createdAt: "desc",
                },
            });
        });
    }
    getExpenseById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const expense = yield this.prisma.expense.findUnique({
                where: { id: id },
            });
            if (!expense) {
                throw {
                    message: "Expense not found",
                    status: http_status_codes_1.StatusCodes.NOT_FOUND,
                };
            }
            return expense;
        });
    }
    createExpense(expense, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.expense.create({
                data: Object.assign(Object.assign({}, expense), { userId: userId }),
            });
        });
    }
    updateExpense(id, expense) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getExpenseById(id);
            return yield this.prisma.expense.update({
                where: { id: id },
                data: Object.assign({}, expense),
            });
        });
    }
    deleteExpense(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getExpenseById(id);
            return yield this.prisma.expense.delete({
                where: { id: id },
            });
        });
    }
}
exports.ExpensesService = ExpensesService;
