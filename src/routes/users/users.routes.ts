import { Router } from "express";
import { validateData } from "../../middlewares/validation-schema.middleware";
import { validateSession } from "../../middlewares/validation-session.middleware";
import { UsersController } from "../../controllers/users/users.controller";
import { UserChangePasswordSchema, UserUpdateSchema } from "../../schemas/users.schema";
import { Request, Response, NextFunction } from "express";

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.get(
  "/",
  validateSession,
  async (req: Request, res: Response, next: NextFunction) =>
    await usersController.getUsers(req, res, next)
);

usersRouter.get(
  "/load-data",
  validateSession,
  async (req: Request, res: Response, next: NextFunction) =>
    usersController.loadData(req, res, next) 
);

usersRouter.get(
  "/payment-history",
  validateSession,
  async (req: Request, res: Response, next: NextFunction) =>
    await usersController.getPaymentHistory(req, res, next)
)

usersRouter.get(
  "/user/:id",
  validateSession,
  async (req: Request, res: Response, next: NextFunction) =>
    await usersController.getUserById(req, res, next)
);

usersRouter.get(
  "/user-by-token",
  validateSession,
  async (req: Request, res: Response, next: NextFunction) =>
    await usersController.getUserByToken(req, res, next)
);

usersRouter.get(
  "/email/:email",
  validateSession,
  async (req: Request, res: Response, next: NextFunction) =>
    await usersController.getUserByEmail(req, res, next)
);

usersRouter.patch(
  "/user/:id",
  validateSession,
  validateData(UserUpdateSchema),
  async (req: Request, res: Response, next: NextFunction) =>
    await usersController.updateUser(req, res, next)
);

usersRouter.delete(
  "/user/:id",
  validateSession,
  async (req: Request, res: Response, next: NextFunction) =>
    await usersController.deleteUser(req, res, next)
);

usersRouter.post(
  "/user/change-password",
  validateSession,
  validateData(UserChangePasswordSchema),
  async (req: Request, res: Response, next: NextFunction) =>
    await usersController.changeUserPassword(req, res, next)
);

export default usersRouter;
