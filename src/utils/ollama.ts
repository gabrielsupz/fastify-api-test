import axios from 'axios'

export const ollamaClient = axios.create({
  baseURL: process.env.OLLAMA_API_URL ?? 'http://localhost:11434',
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
    ...(process.env.OLLAMA_API_KEY && {
      Authorization: `Bearer ${process.env.OLLAMA_API_KEY}`,
    }),
  },
})
