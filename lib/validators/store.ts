import { z } from "zod";

export const StoreFormSchema = z.object({
    name: z.string().min(3).max(32)
})

export type StoreFormType = z.infer<typeof StoreFormSchema>