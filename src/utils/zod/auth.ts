import { z } from 'zod'

export type RegisterBodySchemaType = z.infer<typeof registerBodySchema>
export type LoginBodySchemaType = z.infer<typeof loginBodySchema>
export type LoginResponseSchemaType = z.infer<typeof loginResponseSchema>

export const registerBodySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
})

export const loginBodySchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, { message: 'Senha é orbigatória' }),
})
export const loginResponseSchema = z.object({
  accessToken: z.string(),
})

export const userResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
})
