import z from 'zod'

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(1).max(100).default(10),
})

export type PaginationSchemaType = z.infer<typeof paginationSchema>

export const createPaginatedResponseSchema = <T extends z.ZodTypeAny>(
  contentSchema: T,
) =>
  z.object({
    page: z.number(),
    size: z.number(),
    total: z.number(),
    totalPages: z.number(),
    content: z.array(contentSchema),
  })
