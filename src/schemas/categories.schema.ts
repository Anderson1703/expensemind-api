import { z } from "zod";

export const CategoryCreateSchema = z.object({
    name: z.string(),
    description: z.string().optional()
});

export const CategoryUpdateSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional()
});

export type CategoryCreateType = z.infer<typeof CategoryCreateSchema>;
export type CategoryUpdateType = z.infer<typeof CategoryUpdateSchema>;
