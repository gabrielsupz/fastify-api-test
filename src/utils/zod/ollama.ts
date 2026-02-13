import { z } from 'zod'

export const createConversationResponseSchema = z.object({
  conversationId: z.string(),
})

export type CreateConversationResponseSchemaType = z.infer<
  typeof createConversationResponseSchema
>

export const messageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string(),
})

export const getAllConversationsResponseSchema = z.array(
  z.object({
    conversationId: z.string(),
    messages: z.array(messageSchema),
  }),
)

export type GetAllConversationsResponseSchemaType = z.infer<
  typeof getAllConversationsResponseSchema
>

export const chatBodySchema = z.object({
  conversationId: z.string(),
  message: z
    .string()
    .min(1, 'Mensagem é obrigatória')
    .max(10_000, 'Mensagem muito longa'),
})

export type ChatBodySchemaType = z.infer<typeof chatBodySchema>

export const chatResponseSchema = z.object({
  response: z.string(),
})

export type ChatResponseSchemaType = z.infer<typeof chatResponseSchema>

export const deleteConversationParamsSchema = z.object({
  id: z.string(),
})

export type DeleteConversationParamsSchemaType = z.infer<
  typeof deleteConversationParamsSchema
>

export const deleteConversationResponseSchema = z.object({
  success: z.boolean(),
})

export const testResponseSchema = z.object({
  success: z.boolean(),
  response: z.string(),
})
