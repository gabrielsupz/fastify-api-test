import type { FastifyInstance } from 'fastify'

import { hashPassword } from '@/utils/password'
import {
  loginBodySchema,
  LoginBodySchemaType,
  registerBodySchema,
  RegisterBodySchemaType,
  userResponseSchema,
} from '@/utils/zod/auth'
import { apiErrorSchema } from '@/utils/zod/error'

import { UsersRepository } from '@/repositories/user.repository'

export async function authRoutes(app: FastifyInstance) {
  app.post(
    '/register',
    {
      schema: {
        tags: ['auth'],
        body: registerBodySchema,
        response: {
          201: userResponseSchema,
          409: apiErrorSchema,
        },
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body as RegisterBodySchemaType

      const userAlreadyExists = UsersRepository.findByEmail(email)

      if (userAlreadyExists) {
        return reply.status(409).send({
          message: 'User already exists',
        })
      }

      const passwordHash = await hashPassword(password)

      const user = UsersRepository.create({
        name,
        email,
        password: passwordHash,
      })

      return reply.status(201).send({
        id: user.id,
        name: user.name,
        email: user.email,
      })
    },
  )

  app.post(
    '/login',
    {
      schema: {
        tags: ['auth'],
        body: loginBodySchema,
        response: {
          200: userResponseSchema,
          401: apiErrorSchema,
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body as LoginBodySchemaType

      const user = UsersRepository.findByEmail(email)

      if (!user || user.password !== password) {
        return reply.status(401).send({
          message: 'Invalid credentials',
        })
      }

      return reply.send({
        id: user.id,
        name: user.name,
        email: user.email,
      })
    },
  )
}
