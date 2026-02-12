import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  OLLAMA_API_URL: z.string().url(),
  OLLAMA_API_KEY: z.string().min(1),
  OLLAMA_MODEL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  NODE_ENV: z.enum(['development', 'production', 'test']),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('❌ Invalid environment variables', _env.error.format())
  throw new Error('Invalid environment variables.')
}

export const env = _env.data
