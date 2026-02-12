import { FastifyReply, FastifyRequest } from 'fastify'

import { comparePassword, hashPassword } from '@/utils/password'
import { LoginBodySchemaType, RegisterBodySchemaType } from '@/utils/zod/user'

import { UsersRepository } from './repository'

export async function registerUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
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
}

export async function login(request: FastifyRequest, reply: FastifyReply) {
  const { email, password } = request.body as LoginBodySchemaType

  const user = UsersRepository.findByEmail(email)

  if (!user) {
    return reply.status(401).send({
      message: 'Invalid credentials',
    })
  }

  const passwordMatch = await comparePassword(password, user.password)

  if (!passwordMatch) {
    return reply.status(401).send({
      message: 'Invalid credentials',
    })
  }

  const token = request.jwt.sign({
    id: user.id,
    email: user.email,
    name: user.name,
  })

  reply.setCookie('access_token', token, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })

  return { accessToken: token }
}

export async function logout(request: FastifyRequest, reply: FastifyReply) {
  reply.clearCookie('access_token')
  return reply.send({ message: 'Logout successful' })
}

export async function getMyUserData(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.user.sub
  console.log(request.user)
  const user = UsersRepository.findById(userId)

  if (!user) {
    return reply.status(401).send({
      message: 'User not found',
    })
  }

  return reply.send({
    id: user.id,
    name: user.name,
    email: user.email,
  })
}
