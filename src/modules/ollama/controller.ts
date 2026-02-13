import { FastifyReply, FastifyRequest } from 'fastify'

import axios from 'axios'

import {
  ChatBodySchemaType,
  DeleteConversationParamsSchemaType,
} from '@/utils/zod/ollama'

import { ConversationsRepository } from './repository'

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

export async function getAllUserConversations(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.user.id
  const conversations = await ConversationsRepository.getAll(userId)

  return conversations
}

export async function createConversation(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.user.id

  const conversation = await ConversationsRepository.create(
    userId,
    'Você é um assistente inteligente e responde de forma clara.',
  )

  const conversationId = conversation._id.toString()
  console.log(conversationId)

  return reply.status(201).send({
    conversationId,
  })
}

export async function sendChatMessage(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { conversationId, message } = request.body as ChatBodySchemaType

  const conversation = await ConversationsRepository.findById(conversationId)

  if (!conversation) {
    return reply.status(404).send({ message: 'Conversation not found' })
  }

  await ConversationsRepository.addMessage(conversationId, 'user', message)

  const response = await axios.post(
    `${ollamaApiUrl}/chat`,
    {
      model: ollamaModel,
      messages: conversation.messages,
      stream: false,
    },
    { timeout: 60_000 },
  )

  const assistantReply = response.data.message.content

  await ConversationsRepository.addMessage(
    conversationId,
    'assistant',
    assistantReply,
  )

  return {
    response: assistantReply,
  }
}

export async function deleteConversation(request: FastifyRequest) {
  const { id } = request.params as DeleteConversationParamsSchemaType

  await ConversationsRepository.delete(id)

  return { success: true }
}
