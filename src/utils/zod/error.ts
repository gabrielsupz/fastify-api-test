import z from 'zod'

export const apiErrorSchema = z.object({
  message: z.string(),
})

export type ApiError = z.infer<typeof apiErrorSchema>

export const apiUnauthorizedErrorSchema = z.object({
  message: z.string({ message: 'Unauthorized' }),
})

export type UnauthorizedError = {
  message: 'Unauthorized'
}
