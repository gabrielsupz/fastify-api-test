import { fastify } from 'fastify'

import ScalarApiReference from '@scalar/fastify-api-reference'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { fastifyCors } from '@fastify/cors'
import jwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

import { errorHandler } from './plugins/error-handler'
import { authRoutes } from './routes/auth'

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, {
  origin: 'true',
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
})

app.register(jwt, {
  secret: process.env.JWT_SECRET ?? 'super-secret-key',
})

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Testing API',
      description: 'API for studing and testing.',
      version: '0.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(authRoutes)

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
