import { randomUUID } from 'crypto'

import type { FastifyInstance } from 'fastify'

import axios from 'axios'

import {
  chatBodySchema,
  chatResponseSchema,
  createConversationResponseSchema,
  deleteConversationParamsSchema,
  deleteConversationResponseSchema,
  getAllConversationsResponseSchema,
  testResponseSchema,
  type ChatBodySchemaType,
  type DeleteConversationParamsSchemaType,
} from '@/utils/zod/ollama'

import { inMemoryChatContext } from './im-memory-chat-context'

import { env } from '@/env'

const ROUTE_TAG = 'ollama'

const ollamaApiUrl = env.OLLAMA_API_URL
const ollamaModel = env.OLLAMA_MODEL

export async function ollamaRoutes(app: FastifyInstance) {
  app.get(
    '/test',
    {
      schema: {
        tags: [ROUTE_TAG],
        response: {
          200: testResponseSchema,
        },
      },
    },
    async () => {
      const response = await axios.post(
        `${ollamaApiUrl}/generate`,
        {
          model: ollamaModel,
          prompt:
            'Responda com OK se estiver funcionando e envia a frase do dia.',
          stream: false,
        },
        { timeout: 60_000 },
      )

      return {
        success: true,
        response: response.data.response,
      }
    },
  )

  app.get(
    '/conversations',
    {
      schema: {
        tags: [ROUTE_TAG],
        response: {
          200: getAllConversationsResponseSchema,
        },
      },
    },
    async () => {
      const conversations = inMemoryChatContext.getAllConversations()

      return conversations
    },
  )

  app.post(
    '/conversation',
    {
      schema: {
        tags: [ROUTE_TAG],
        response: {
          201: createConversationResponseSchema,
        },
      },
    },
    async (_, reply) => {
      const conversationId = randomUUID()

      inMemoryChatContext.createConversation(
        conversationId,
        'Você é um assistente inteligente e responde de forma clara.',
      )

      return reply.status(201).send({
        conversationId,
      })
    },
  )

  app.post(
    '/chat',
    {
      schema: {
        tags: [ROUTE_TAG],
        body: chatBodySchema,
        response: {
          200: chatResponseSchema,
        },
      },
    },
    async request => {
      const { conversationId, message } = request.body as ChatBodySchemaType

      inMemoryChatContext.addMessage(conversationId, 'user', message)

      const messages = inMemoryChatContext.getMessages(conversationId)

      const response = await axios.post(
        `${ollamaApiUrl}/chat`,
        {
          model: ollamaModel,
          messages,
          stream: false,
        },
        { timeout: 60_000 },
      )

      const assistantReply = response.data.message.content

      inMemoryChatContext.addMessage(
        conversationId,
        'assistant',
        assistantReply,
      )

      return {
        response: assistantReply,
        contextSize: messages.length,
      }
    },
  )

  app.delete(
    '/conversation/:id',
    {
      schema: {
        tags: [ROUTE_TAG],
        params: deleteConversationParamsSchema,
        response: {
          200: deleteConversationResponseSchema,
        },
      },
    },
    async request => {
      const { id } = request.params as DeleteConversationParamsSchemaType

      inMemoryChatContext.clearConversation(id)

      return { success: true }
    },
  )
}
