import { ConversationModel } from './model'

export const ConversationsRepository = {
  async create(userId: string, systemPrompt?: string) {
    const messages = []

    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt })
    }

    return ConversationModel.create({
      userId,
      messages,
    })
  },

  async findById(id: string) {
    return ConversationModel.findById(id)
  },

  async getAll(userId: string) {
    return ConversationModel.find({ userId })
      .select('_id createdAt updatedAt')
      .sort({ createdAt: -1 })
  },

  async addMessage(conversationId: string, role: string, content: string) {
    return ConversationModel.findByIdAndUpdate(
      conversationId,
      {
        $push: { messages: { role, content } },
      },
      { new: true },
    )
  },

  async delete(conversationId: string) {
    return ConversationModel.findByIdAndDelete(conversationId)
  },
}
