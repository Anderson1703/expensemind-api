import { z } from "zod";

export const UserResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  profile_picture: z.string().optional().nullable(),
  createAt: z.date(),
});

export const UserUpdateSchema = z.object({
  name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string().email().optional(),
  profile_picture: z.string().optional().nullable(),
});

export const UserCreateSchema = z.object({
  planId: z.string(),
  name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

export const UserChangePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string(),
});

export type UserResponseType = z.infer<typeof UserResponseSchema>;
export type UserUpdateType = z.infer<typeof UserUpdateSchema>;
export type UserCreateType = z.infer<typeof UserCreateSchema>;
