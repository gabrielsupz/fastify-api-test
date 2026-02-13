import { randomUUID } from 'node:crypto'

import { FastifyReply, FastifyRequest } from 'fastify'

import axios from 'axios'

import {
  ChatBodySchemaType,
  DeleteConversationParamsSchemaType,
} from '@/utils/zod/ollama'

import { inMemoryChatContext } from './im-memory-chat-context'

import { env } from '@/env'

const ollamaApiUrl = env.OLLAMA_API_URL
const ollamaModel = env.OLLAMA_MODEL

export async function ollamaTest() {
  const response = await axios.post(
    `${ollamaApiUrl}/generate`,
    {
      model: ollamaModel,
      prompt: 'Responda com OK se estiver funcionando e envia a frase do dia.',
      stream: false,
    },
    { timeout: 60_000 },
  )

  return {
    success: true,
    response: response.data.response,
  }
}

export async function getAllConversations() {
  const conversations = inMemoryChatContext.getAllConversations()

  return conversations
}

export async function createConversation(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const conversationId = randomUUID()

  inMemoryChatContext.createConversation(
    conversationId,
    'Você é um assistente inteligente e responde de forma clara.',
  )

  return reply.status(201).send({
    conversationId,
  })
}

export async function sendChatMessage(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { conversationId, message } = request.body as ChatBodySchemaType

  inMemoryChatContext.addMessage(conversationId, 'user', message)

  const messages = inMemoryChatContext.getMessages(conversationId)

  const response = await axios.post(
    `${ollamaApiUrl}/chat`,
    {
      model: ollamaModel,
      messages,
      stream: false,
    },
    { timeout: 60_000 },
  )

  const assistantReply = response.data.message.content

  inMemoryChatContext.addMessage(conversationId, 'assistant', assistantReply)

  return {
    response: assistantReply,
    contextSize: messages.length,
  }
}

export async function deleteConversation(request: FastifyRequest) {
  const { id } = request.params as DeleteConversationParamsSchemaType

  inMemoryChatContext.clearConversation(id)

  return { success: true }
}
