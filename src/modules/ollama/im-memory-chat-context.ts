type Role = 'system' | 'user' | 'assistant'

export interface ChatMessage {
  role: Role
  content: string
}

class InMemoryChatContext {
  private conversations = new Map<string, ChatMessage[]>()

  createConversation(conversationId: string, systemPrompt?: string) {
    if (!this.conversations.has(conversationId)) {
      const initialMessages: ChatMessage[] = []

      if (systemPrompt) {
        initialMessages.push({
          role: 'system',
          content: systemPrompt,
        })
      }

      this.conversations.set(conversationId, initialMessages)
    }
  }

  getMessages(conversationId: string): ChatMessage[] {
    return this.conversations.get(conversationId) || []
  }

  getAllConversations() {
    return Array.from(this.conversations.entries()).map(
      ([conversationId, messages]) => ({
        conversationId,
        messages,
      }),
    )
  }

  addMessage(conversationId: string, role: Role, content: string) {
    const messages = this.getMessages(conversationId)

    messages.push({ role, content })

    // Mantém só últimas 12 mensagens pra não explodir contexto
    if (messages.length > 12) {
      messages.splice(1, messages.length - 12)
    }

    this.conversations.set(conversationId, messages)
  }

  clearConversation(conversationId: string) {
    this.conversations.delete(conversationId)
  }
}

export const inMemoryChatContext = new InMemoryChatContext()
