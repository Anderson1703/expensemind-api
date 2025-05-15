import { Router, Request, Response, NextFunction } from "express";
import { validateSession } from "../../middlewares/validation-session.middleware";
import { validateData } from "../../middlewares/validation-schema.middleware";
import {
  CategoryCreateSchema,
  CategoryUpdateSchema,
} from "../../schemas/categories.schema";
import { CategoriesController } from "../../controllers/categories/categories.controller";

const categoriesRouter = Router();
const categoriesController = new CategoriesController();

categoriesRouter.get(
  "/",
  validateSession,
  async (req: Request, res: Response, next: NextFunction) =>
    categoriesController.getCategories(req, res, next)
);

categoriesRouter.get(
  "/category/:id",
  validateSession,
  async (req: Request, res: Response, next: NextFunction) =>
    categoriesController.getCategoryById(req, res, next)
);

categoriesRouter.post(
  "/",
  validateSession,
  validateData(CategoryCreateSchema),
  async (req: Request, res: Response, next: NextFunction) =>
    categoriesController.createCategory(req, res, next)
);

categoriesRouter.patch(
  "/category/:id",
  validateSession,
  validateData(CategoryUpdateSchema),
  async (req: Request, res: Response, next: NextFunction) =>
    categoriesController.updateCategory(req, res, next)
);

categoriesRouter.delete(
  "/category/:id",
  validateSession,
  async (req: Request, res: Response, next: NextFunction) =>
    categoriesController.deleteCategory(req, res, next)
);

export default categoriesRouter;
