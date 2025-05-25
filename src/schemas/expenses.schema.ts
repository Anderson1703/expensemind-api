import { z } from "zod";

export const ExpenseCreateSchema = z.object({
  categoryId: z.string(),
  date: z.string().transform((date) => new Date(date)),
  totalAmount: z.number(),
  urlFile: z.string().optional(),
  info: z.string().optional(),
  business: z.string().optional(),
});

export const ExpenseUpdateSchema = z.object({
  date: z
    .string()
    .transform((date) => new Date(date))
    .optional(),
  totalAmount: z.number().optional(),
  urlFile: z.string().optional(),
  info: z.string().optional(),
  business: z.string().optional(),
});

export type ExpenseCreateType = z.infer<typeof ExpenseCreateSchema>;
export type ExpenseUpdateType = z.infer<typeof ExpenseUpdateSchema>;
