import { ConversationModel } from './model'

export const ConversationsRepository = {
  async create(userId: string, title: string, systemPrompt?: string) {
    const messages = []

    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt })
    }

    return ConversationModel.create({
      userId,
      title,
      messages,
    })
  },

  async findById(id: string) {
    return ConversationModel.findById(id)
  },

  async findByIdAndUserId(conversationId: string, userId: string) {
    return ConversationModel.findOne(
      {
        _id: conversationId,
        userId,
      },
      {
        messages: 0,
      },
    ).lean()
  },

  async favorite(conversationId: string, userId: string) {
    return ConversationModel.findOneAndUpdate(
      { _id: conversationId, userId },
      { isFavorite: true },
      { new: true },
    )
  },

  async unfavorite(conversationId: string, userId: string) {
    return ConversationModel.findOneAndUpdate(
      { _id: conversationId, userId },
      { isFavorite: false },
      { new: true },
    )
  },

  async getAll(userId: string) {
    return ConversationModel.find({ userId })
      .select({
        _id: 1,
        createdAt: 1,
        updatedAt: 1,
        isFavorite: 1,
        title: 1,
      })
      .sort({ createdAt: -1 })
  },

  async addMessage(conversationId: string, role: string, content: string) {
    return ConversationModel.findByIdAndUpdate(
      conversationId,
      {
        $push: { messages: { role, content } },
      },
      { new: true, returnDocument: 'after' },
    )
  },

  async delete(conversationId: string, userId: string) {
    return ConversationModel.findOneAndDelete({
      _id: conversationId,
      userId,
    })
  },
}
