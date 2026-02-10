import z from 'zod'

export const apiErrorSchema = z.object({
  message: z.string(),
})

export type ApiError = z.infer<typeof apiErrorSchema>
