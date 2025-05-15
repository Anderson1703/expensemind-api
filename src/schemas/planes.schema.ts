import { z } from "zod";

export const PlanCreateSchema = z.object({
  planType: z.enum(["FREE", "PREMIUM"]),
  price: z.number(),
  dailyFilesLimit: z.number(),
  categoryLimit: z.number(),
  hasTemplates: z.boolean(),
  autoEmailReports: z.boolean(),
  allowedFormats: z.array(z.enum(["PDF", "CSV", "EXCEL"])),
});

export const PlanUpdateSchema = z.object({
  planType: z.enum(["FREE", "PREMIUM"]).optional(),
  price: z.number().optional(),
  dailyFilesLimit: z.number().optional(),
  categoryLimit: z.number().optional(),
  hasTemplates: z.boolean().optional(),
  autoEmailReports: z.boolean().optional(),
  allowedFormats: z.array(z.enum(["PDF", "CSV", "EXCEL"])).optional(),
});

export type PlanUpdateType = z.infer<typeof PlanUpdateSchema>;
export type PlanCreateType = z.infer<typeof PlanCreateSchema>;
