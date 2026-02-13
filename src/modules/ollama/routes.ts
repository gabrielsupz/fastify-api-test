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
  getAllUserConversations,
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
      preHandler: [app.authenticate],
      schema: {
        tags: [ROUTE_TAG],

        security: [{ cookieAuth: [] }],
        response: {
          200: getAllConversationsResponseSchema,
        },
      },
    },
    getAllUserConversations,
  )

  app.post(
    '/conversation',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: [ROUTE_TAG],
        security: [{ cookieAuth: [] }],
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
      preHandler: [app.authenticate],
      schema: {
        tags: [ROUTE_TAG],

        security: [{ cookieAuth: [] }],
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
      preHandler: [app.authenticate],
      schema: {
        tags: [ROUTE_TAG],

        security: [{ cookieAuth: [] }],
        params: deleteConversationParamsSchema,
        response: {
          200: deleteConversationResponseSchema,
        },
      },
    },
    deleteConversation,
  )
}
