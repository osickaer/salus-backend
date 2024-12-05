import { Injectable, NotFoundException } from "@nestjs/common";
import { EntityManager } from "@mikro-orm/postgresql";
import { Conversations } from "src/entities/Conversations";
import { ChatMessages } from "src/entities/ChatMessages";

@Injectable()
export class ChatService {
  constructor(private readonly em: EntityManager) {}

  async getUserConversations(userId: string): Promise<Conversations[]> {
    const conversations = await this.em.find(
      Conversations,
      { user: userId },
      {
        orderBy: { createdAt: "DESC" },
        limit: 7,
      }
    );

    // If no conversations are found, return an empty array
    if (!conversations || conversations.length === 0) {
      return []; // Graceful handling for new users
    }
    return conversations;
  }

  async getConversationChatMessages(
    userId: string,
    conversationId: string
  ): Promise<ChatMessages[]> {
    const chatMessages = await this.em.find(
      ChatMessages,
      { conversation: { conversationId }, user: userId },
      {
        orderBy: { chatTimestamp: "ASC" },
      }
    );

    // If no conversations are found, return an empty array
    if (!chatMessages || chatMessages.length === 0) {
      return []; // Graceful handling for new users
    }
    return chatMessages;
  }
}
