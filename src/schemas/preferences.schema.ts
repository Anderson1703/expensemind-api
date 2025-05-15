import { z } from "zod";

export const PreferenceCreateSchema = z.object({
    theme: z.enum(["LIGHT", "DARK"]),
    language: z.enum(["EN", "ES"]),
    twoFactor: z.boolean(),
});
export const PreferenceUpdateSchema = z.object({
    theme: z.enum(["LIGHT", "DARK"]).optional(),
    language: z.enum(["EN", "ES"]).optional(),
    twoFactor: z.boolean().optional(),
});

export type PreferenceCreateType = z.infer<typeof PreferenceCreateSchema>;
export type PreferenceUpdateType = z.infer<typeof PreferenceUpdateSchema>;