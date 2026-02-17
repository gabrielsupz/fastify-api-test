import z from 'zod'

import { createPaginatedResponseSchema } from './pagination'

export const messageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string(),
})

export const messageResponseSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
})

export const createConversationSchema = z.object({
  message: z.string().min(1).max(10_000),
})

export const createConversationResponseSchema = z.object({
  conversationId: z.string(),
  response: z.string(),
})

export type CreateConversationSchemaType = z.infer<
  typeof createConversationSchema
>

export type CreateConversationResponseSchemaType = z.infer<
  typeof createConversationResponseSchema
>

export const getAllConversationsResponseSchema = z.array(
  z.object({
    isFavorite: z.boolean(),
    id: z.string(),
    title: z.string().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  }),
)

export type GetAllConversationsResponseSchemaType = z.infer<
  typeof getAllConversationsResponseSchema
>

export const getConversationByIdParamsSchema = z.object({
  id: z.string(),
})

export const getConversationByIdResponseSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  isFavorite: z.boolean().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type GetConversationByIdParamsSchemaType = z.infer<
  typeof getConversationByIdParamsSchema
>

export type GetConversationByIdResponseSchemaType = z.infer<
  typeof getConversationByIdResponseSchema
>

export const paginatedMessagesResponseSchema = createPaginatedResponseSchema(
  messageResponseSchema,
)

export const chatBodySchema = z.object({
  conversationId: z.string(),
  message: z.string().min(1).max(10_000),
})

export const chatResponseSchema = z.object({
  response: z.string(),
})

export type ChatBodySchemaType = z.infer<typeof chatBodySchema>
export type ChatResponseSchemaType = z.infer<typeof chatResponseSchema>

export const favoriteConversationSchema = z.object({
  conversationId: z.string(),
})

export type FavoriteConversationSchemaType = z.infer<
  typeof favoriteConversationSchema
>

export const deleteConversationParamsSchema = z.object({
  id: z.string(),
})

export const deleteConversationResponseSchema = z.object({
  success: z.boolean(),
})

export type DeleteConversationParamsSchemaType = z.infer<
  typeof deleteConversationParamsSchema
>

export const testResponseSchema = z.object({
  success: z.boolean(),
  response: z.string(),
})
