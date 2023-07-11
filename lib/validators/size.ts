import { z } from "zod";

export const SizesFormSchema = z.object({
    name: z.string().min(3),
    value: z.string().min(1),
})

export type SizesFormType = z.infer<typeof SizesFormSchema>