import { z } from "zod";

export const settingsSchema = z.object({
    name: z.string().min(3).max(32)
})

export type SettingsFormType = z.infer<typeof settingsSchema>