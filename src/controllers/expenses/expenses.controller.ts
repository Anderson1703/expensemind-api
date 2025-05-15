import { StatusCodes } from "http-status-codes";
import { ExpensesService } from "../../services/expenses/expenses.service";
import { Request, Response, NextFunction } from "express";

export class ExpensesController {
  private expensesService: ExpensesService;

  constructor() {
    this.expensesService = new ExpensesService();
  }

  async getExpenses(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).current_user.id;

      const expenses = await this.expensesService.getExpenses(userId);

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        body: expenses,
      });
    } catch (error: any) {
      console.log("Error in getExpenses: ", error);
      res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          error: {
            message: error.message || "Server error while fetching expenses",
          },
        },
      });
    }
  }

  async getExpenseById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id }: any = req.params;

      const expense = await this.expensesService.getExpenseById(id);

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        body: expense,
      });
    } catch (error: any) {
      console.log("Error in getExpenseById: ", error);
      res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          error: {
            message: error.message || "Server error while fetching expense",
          },
        },
      });
    }
  }

  async createExpense(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).current_user.id;
      const expense = req.body;

      const createdExpense = await this.expensesService.createExpense(
        expense,
        userId
      );

      res.status(StatusCodes.CREATED).json({
        status: StatusCodes.CREATED,
        body: createdExpense,
      });
    } catch (error: any) {
      console.log("Error in createExpense: ", error);
      res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          error: {
            message: error.message || "Server error while creating expense",
          },
        },
      });
    }
  }

  async updateExpense(req: Request, res: Response, next: NextFunction) {
    try {
      const { id }: any = req.params;
      const expense = req.body;

      const updatedExpense = await this.expensesService.updateExpense(
        id,
        expense
      );

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        body: updatedExpense,
      });
    } catch (error: any) {
      console.log("Error in updateExpense: ", error);
      res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          error: {
            message: error.message || "Server error while updating expense",
          },
        },
      });
    }
  }

  async deleteExpense(req: Request, res: Response, next: NextFunction) {
    try {
      const { id }: any = req.params;

      await this.expensesService.deleteExpense(id);

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        body: {
          message: "Expense deleted successfully",
        },
      });
    } catch (error: any) {
      console.log("Error in deleteExpense: ", error);
      res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          error: {
            message: error.message || "Server error while deleting expense",
          },
        },
      });
    }
  }
}
