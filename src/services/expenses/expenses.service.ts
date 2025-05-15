import { PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import {
  ExpenseCreateType,
  ExpenseUpdateType,
} from "../../schemas/expenses.schema";

export class ExpensesService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getExpenses(userId: string) {
    return await this.prisma.expense.findMany({
      where: { userId: userId },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getExpenseById(id: string) {
    const expense = await this.prisma.expense.findUnique({
      where: { id: id },
    });

    if (!expense) {
      throw {
        message: "Expense not found",
        status: StatusCodes.NOT_FOUND,
      };
    }

    return expense;
  }

  async createExpense(expense: ExpenseCreateType, userId: string) {
    return await this.prisma.expense.create({
      data: {
        ...expense,
        userId: userId,
      },
    });
  }

  async updateExpense(id: string, expense: ExpenseUpdateType) {
    await this.getExpenseById(id);

    return await this.prisma.expense.update({
      where: { id: id },
      data: {
        ...expense,
      },
    });
  }

  async deleteExpense(id: string) {
    await this.getExpenseById(id);

    return await this.prisma.expense.delete({
      where: { id: id },
    });
  }
}
