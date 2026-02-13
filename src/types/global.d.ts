/* eslint-disable @typescript-eslint/no-explicit-any */
import '@fastify/jwt'

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: any
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    jwt: JWT
  }
}

type UserPayload = {
  id: string
  email: string
  name: string
}
declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: UserPayload
  }
}
