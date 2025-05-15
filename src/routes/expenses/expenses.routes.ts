import { Router, Request, Response, NextFunction } from "express";
import { validateSession } from "../../middlewares/validation-session.middleware";
import { validateData } from "../../middlewares/validation-schema.middleware";
import {
  ExpenseCreateSchema,
  ExpenseUpdateSchema,
} from "../../schemas/expenses.schema";
import { ExpensesController } from "../../controllers/expenses/expenses.controller";

const expensesRouter = Router();
const expensesController = new ExpensesController();

expensesRouter.get(
  "/",
  validateSession,
  async (req: Request, res: Response, next: NextFunction) =>
    expensesController.getExpenses(req, res, next)
);

expensesRouter.post(
  "/",
  validateSession,
  validateData(ExpenseCreateSchema),
  async (req: Request, res: Response, next: NextFunction) =>
    expensesController.createExpense(req, res, next)
);

expensesRouter.get(
  "/expense/:id",
  validateSession,
  async (req: Request, res: Response, next: NextFunction) =>
    expensesController.getExpenseById(req, res, next)
);

expensesRouter.patch(
  "/expense/:id",
  validateSession,
  validateData(ExpenseUpdateSchema),
  async (req: Request, res: Response, next: NextFunction) =>
    expensesController.updateExpense(req, res, next)
);

expensesRouter.delete(
  "/expense/:id",
  validateSession,
  async (req: Request, res: Response, next: NextFunction) =>
    expensesController.deleteExpense(req, res, next)
);

export default expensesRouter;
