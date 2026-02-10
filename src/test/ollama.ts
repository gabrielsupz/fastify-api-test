import type { FastifyInstance } from 'fastify'

import axios from 'axios'

export async function ollamaTestRoute(app: FastifyInstance) {
  app.get('/test/ollama', async () => {
    const response = await axios.post(
      'http://localhost:11434/api/generate',
      {
        model: 'gpt-oss:120b-cloud',
        prompt:
          'Responda com OK se estiver funcionando e envia a frase do dia.',
        stream: false,
      },
      {
        timeout: 60_000,
      },
    )

    return {
      success: true,
      response: response.data.response,
    }
  })
}
