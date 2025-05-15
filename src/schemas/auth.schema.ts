import { z } from "zod";

export const UserLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const UserForgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const UserResetPasswordSchema = z.object({
  password: z.string().min(8),
  token: z.string(),
});

export const UserOTPVerificationSchema = z.object({
  OTPCode: z.string().min(5),
  email: z.string().email(),
});
