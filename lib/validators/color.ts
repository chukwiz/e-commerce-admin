import { z } from "zod";

export const ColorsFormSchema = z.object({
    name: z.string().min(3),
    value: z.string().min(4).regex(/^#/, {
        message: "String must be a valid hex code"
    }),
})

export type ColorsFormType = z.infer<typeof ColorsFormSchema>