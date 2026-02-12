import { FastifyRequest, FastifyReply } from 'fastify'

export async function logout(req: FastifyRequest, reply: FastifyReply) {
  reply.clearCookie('access_token')
  return reply.send({ message: 'Logout successful' })
}
