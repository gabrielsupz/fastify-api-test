import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify'

import { ZodError } from 'zod'

export function errorHandler(
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  if (error instanceof ZodError) {
    const exceptions: Record<string, string> = {}

    for (const issue of error.issues) {
      const field = issue.path.join('.')
      exceptions[field] = issue.message
    }

    return reply.status(400).send({
      message: 'Validation error',
      exceptions,
    })
  }

  if (error.validation) {
    const exceptions: Record<string, string> = {}

    for (const issue of error.validation) {
      const field = issue.instancePath.replace('/', '')
      if (field && issue.message) exceptions[field] = issue.message
    }

    return reply.status(400).send({
      message: 'Validation error',
      exceptions,
    })
  }

  return reply.status(500).send({
    message: error.message ?? 'Internal server error',
  })
}
