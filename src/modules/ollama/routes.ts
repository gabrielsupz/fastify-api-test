import type { FastifyInstance } from 'fastify'

import { apiErrorSchema, apiGenericReturn } from '@/utils/zod/error'
import {
  chatBodySchema,
  chatResponseSchema,
  createConversationResponseSchema,
  createConversationSchema,
  deleteConversationParamsSchema,
  deleteConversationResponseSchema,
  favoriteConversationSchema,
  getAllConversationsResponseSchema,
  getConversationByIdParamsSchema,
  getConversationByIdResponseSchema,
  testResponseSchema,
} from '@/utils/zod/ollama'

import {
  createConversation,
  deleteConversation,
  favoriteConversation,
  getAllUserConversations,
  getConversationById,
  ollamaTest,
  sendChatMessage,
  unfavoriteConversation,
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
          401: apiErrorSchema,
        },
      },
    },
    getAllUserConversations,
  )

  app.get(
    '/conversations/:id',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: [ROUTE_TAG],
        security: [{ cookieAuth: [] }],
        params: getConversationByIdParamsSchema,
        response: {
          200: getConversationByIdResponseSchema,
          401: apiErrorSchema,
          404: apiErrorSchema,
        },
      },
    },
    getConversationById,
  )

  app.post(
    '/conversation',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: [ROUTE_TAG],
        body: createConversationSchema,
        security: [{ cookieAuth: [] }],
        response: {
          201: createConversationResponseSchema,
          401: apiErrorSchema,
        },
      },
    },
    createConversation,
  )

  app.patch(
    '/conversation/favorite',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: [ROUTE_TAG],
        body: favoriteConversationSchema,
        security: [{ cookieAuth: [] }],
        response: {
          200: apiGenericReturn,
          401: apiErrorSchema,
        },
      },
    },
    favoriteConversation,
  )

  app.patch(
    '/conversation/unfavorite',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: [ROUTE_TAG],
        body: favoriteConversationSchema,
        security: [{ cookieAuth: [] }],
        response: {
          200: apiGenericReturn,
          401: apiErrorSchema,
        },
      },
    },
    unfavoriteConversation,
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
          401: apiErrorSchema,
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
          401: apiErrorSchema,
        },
      },
    },
    deleteConversation,
  )
}
