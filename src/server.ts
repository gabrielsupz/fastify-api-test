import { fastify, FastifyReply, FastifyRequest } from 'fastify'

import ScalarApiReference from '@scalar/fastify-api-reference'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'

import fCookie from '@fastify/cookie'
import { fastifyCors } from '@fastify/cors'
import fjwt, { FastifyJWT } from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

import { errorHandler } from './plugins/error-handler'
import { authRoutes } from './routes/auth'
import { healthcheckRoutes } from './test/health-check'
import { ollamaTestRoute } from './test/ollama'

const listeners = ['SIGINT', 'SIGTERM']
listeners.forEach(signal => {
  process.on(signal, async () => {
    await app.close()
    process.exit(0)
  })
})

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, {
  origin: 'true',
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
})

app.register(fjwt, { secret: 'supersecretcode-CHANGE_THIS-USE_ENV_FILE' })

app.addHook('preHandler', (req, res, next) => {
  // here we are
  req.jwt = app.jwt
  return next()
})

// cookies
app.register(fCookie, {
  secret: 'some-secret-key',
  hook: 'preHandler',
})

app.decorate(
  'authenticate',
  async (req: FastifyRequest, reply: FastifyReply) => {
    const token = req.cookies.access_token
    console.log('cookies:', req.cookies)
    if (!token) {
      return reply.status(401).send({ message: 'Authentication required' })
    }
    // aqui, decoded será um tipo diferente por padrão, mas queremos que seja do tipo user-payload
    const decoded = req.jwt.verify<FastifyJWT['user']>(token)
    req.user = decoded
  },
)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Testing API',
      version: '0.0.0',
    },
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'access_token',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})

app.register(authRoutes)
app.register(ollamaTestRoute)
app.register(healthcheckRoutes)

app.setErrorHandler(errorHandler)

app.register(ScalarApiReference, {
  routePrefix: '/docs',
})

if (process.env.NODE_ENV !== 'production') {
  app.register(fastifySwaggerUi, {
    routePrefix: '/swagger',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
  })
}

app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log('🚀 App server running on http://localhost:3333')
  console.log('📘 Swagger UI: http://localhost:3333/swagger')
  console.log('✨ Scalar Docs: http://localhost:3333/docs')
})
