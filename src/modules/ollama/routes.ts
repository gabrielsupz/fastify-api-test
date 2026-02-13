import type { FastifyInstance } from 'fastify'

import {
  chatBodySchema,
  chatResponseSchema,
  createConversationResponseSchema,
  deleteConversationParamsSchema,
  deleteConversationResponseSchema,
  getAllConversationsResponseSchema,
  testResponseSchema,
} from '@/utils/zod/ollama'

import {
  createConversation,
  deleteConversation,
  getAllConversations,
  ollamaTest,
  sendChatMessage,
} from './controller'

const ROUTE_TAG = 'ollama'

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
    ollamaTest,
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
    getAllConversations,
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
    createConversation,
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
    sendChatMessage,
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
    deleteConversation,
  )
}
