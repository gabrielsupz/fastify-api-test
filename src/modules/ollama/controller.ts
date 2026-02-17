import { FastifyReply, FastifyRequest } from 'fastify'

import axios from 'axios'

import {
  ChatBodySchemaType,
  CreateConversationSchemaType,
  DeleteConversationParamsSchemaType,
  FavoriteConversationSchemaType,
  GetConversationByIdParamsSchemaType,
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

  return reply.status(200).send(conversations)
}

export async function getConversationById(
  request: FastifyRequest<{ Params: GetConversationByIdParamsSchemaType }>,
  reply: FastifyReply,
) {
  const { id } = request.params
  const userId = request.user.id

  const conversation = await ConversationsRepository.findByIdAndUserId(
    id,
    userId,
  )

  if (!conversation) {
    return reply.status(404).send({ message: 'Conversation not found' })
  }

  return reply.status(200).send({
    ...conversation,
    id: conversation._id.toString(),
    userId: conversation.userId.toString(),
  })
}

export async function createConversation(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { message } = request.body as CreateConversationSchemaType
  const userId = request.user.id

  const conversation = await ConversationsRepository.create(
    userId,
    message,
    'Você é um assistente inteligente e responde de forma clara.',
  )

  const conversationId = conversation._id.toString()

  const updatedConversation = await ConversationsRepository.addMessage(
    conversationId,
    'user',
    message,
  )

  if (!updatedConversation) {
    return reply.status(402).send({
      message: 'An error occurred while creating the conversation record.',
    })
  }

  const response = await axios.post(`${ollamaApiUrl}/chat`, {
    model: ollamaModel,
    messages: updatedConversation.messages,
    stream: false,
  })

  const assistantReply = response.data.message.content

  await ConversationsRepository.addMessage(
    conversationId,
    'assistant',
    assistantReply,
  )

  return reply.status(201).send({
    conversationId,
    response: assistantReply,
  })
}

export async function sendChatMessage(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { conversationId, message } = request.body as ChatBodySchemaType

  const updatedConversation = await ConversationsRepository.addMessage(
    conversationId,
    'user',
    message,
  )

  if (!updatedConversation) {
    return reply.status(404).send({ message: 'Conversation not found' })
  }

  const response = await axios.post(
    `${ollamaApiUrl}/chat`,
    {
      model: ollamaModel,
      messages: updatedConversation.messages,
      stream: false,
    },
    { timeout: 60_000 },
  )

  const assistantReply = response.data.message?.content ?? ''

  console.log({
    assistantReply,
    message,
    'data.message: ': response.data.message,
  })
  await ConversationsRepository.addMessage(
    conversationId,
    'assistant',
    assistantReply,
  )

  return {
    response: assistantReply,
  }
}

export async function favoriteConversation(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { conversationId } = request.body as FavoriteConversationSchemaType
  const userId = request.user.id

  await ConversationsRepository.favorite(conversationId, userId)

  return reply
    .status(200)
    .send({ message: 'Conversation successfully favorited.' })
}

export async function unfavoriteConversation(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { conversationId } = request.body as FavoriteConversationSchemaType
  const userId = request.user.id

  await ConversationsRepository.unfavorite(conversationId, userId)

  return reply
    .status(200)
    .send({ message: 'Conversation successfully unfavorited.' })
}

export async function deleteConversation(request: FastifyRequest) {
  const { id } = request.params as DeleteConversationParamsSchemaType
  const userId = request.user.id

  await ConversationsRepository.delete(id, userId)

  return { success: true }
}
