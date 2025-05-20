import { Router } from "express";
import { validateData } from "../../middlewares/validation-schema.middleware";
import { AuthController } from "../../controllers/auth/auth.controller";
import { UserCreateSchema } from "../../schemas/users.schema";
import { UsersController } from "../../controllers/users/users.controller";
import {
  UserForgotPasswordSchema,
  UserLoginSchema,
  UserOTPVerificationSchema,
  UserResetPasswordSchema,
} from "../../schemas/auth.schema";
import { Request, Response, NextFunction } from "express";

const authRouter = Router();
const authController = new AuthController();
const usersController = new UsersController();

authRouter.post(
  "/login",
  validateData(UserLoginSchema),
  async (req: Request, res: Response, next: NextFunction) =>
    await authController.login(req, res, next)
);

authRouter.post(
  "/register",
  validateData(UserCreateSchema),
  async (req: Request, res: Response, next: NextFunction) =>
    usersController.createUser(req, res, next)
);

authRouter.post(
  "/forgot-password",
  validateData(UserForgotPasswordSchema),
  async (req: Request, res: Response, next: NextFunction) =>
    authController.sendResetPasswordEmail(req, res, next)
);

authRouter.post(
  "/send-otp",
  validateData(UserForgotPasswordSchema),
  async (req: Request, res: Response, next: NextFunction) =>
    authController.sendOtpCode(req, res, next)
);

authRouter.post(
  "/reset-password",
  validateData(UserResetPasswordSchema),
  async (req: Request, res: Response, next: NextFunction) =>
    authController.resetPassword(req, res, next)
);

authRouter.post(
  "/verify-otp",
  validateData(UserOTPVerificationSchema),
  async (req: Request, res: Response, next: NextFunction) =>
    authController.verifyOTPCode(req, res, next)
);

export default authRouter;
