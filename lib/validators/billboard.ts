import { z } from "zod";

export const BillboardSchema = z.object({
    label: z.string().min(3).max(32),
    imageUrl: z.string().min(3).max(100)
})

export type BillboardType = z.infer<typeof BillboardSchema>