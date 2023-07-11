import { z } from "zod";

export const CategoryFormSchema = z.object({
    name: z.string().min(3).max(32),
    billboardId: z.string().min(3)
})

export type CategoryType = z.infer<typeof CategoryFormSchema>