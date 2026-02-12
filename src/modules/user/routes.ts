import type { FastifyInstance } from 'fastify'

import { apiErrorSchema, apiGenericReturn } from '@/utils/zod/error'
import {
  loginBodySchema,
  loginResponseSchema,
  registerBodySchema,
  userResponseSchema,
} from '@/utils/zod/user'

import { getMyUserData, login, logout, registerUser } from './controller'

const ROUTE_TAG = 'user'

export async function userRoutes(app: FastifyInstance) {
  app.post(
    '/register',
    {
      schema: {
        tags: [ROUTE_TAG],
        body: registerBodySchema,
        response: {
          201: userResponseSchema,
          409: apiErrorSchema,
        },
      },
    },
    registerUser,
  )

  app.post(
    '/login',
    {
      schema: {
        tags: [ROUTE_TAG],
        body: loginBodySchema,
        response: {
          200: loginResponseSchema,
          401: apiErrorSchema,
        },
      },
    },
    login,
  )

  app.get(
    '/me',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: [ROUTE_TAG],

        security: [{ cookieAuth: [] }],
        response: {
          200: userResponseSchema,
          401: apiErrorSchema,
          403: apiErrorSchema,
        },
      },
    },
    getMyUserData,
  )

  app.delete(
    '/logout',
    {
      schema: {
        tags: [ROUTE_TAG],
        response: {
          200: apiGenericReturn,
          403: apiErrorSchema,
        },
      },
      preHandler: [app.authenticate],
    },
    logout,
  )
}
