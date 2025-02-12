import { Injectable, NotFoundException } from "@nestjs/common";
import { EntityManager } from "@mikro-orm/postgresql";
import { Conversations } from "src/entities/Conversations";
import { ChatMessages } from "src/entities/ChatMessages";
import { AiService } from "../ai/ai.service";

@Injectable()
export class ChatService {
  constructor(
    private readonly em: EntityManager,
    private readonly aiService: AiService
  ) {}

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

  async generateChatResponse(
    userId: string,
    userFullName: string,
    conversationId: string,
    userQuery: string,
    chatTimestamp: string
  ): Promise<any> {
    // Call the AI service to generate a response
    const aiResponse = await this.aiService.generateChatResponse(
      userId,
      userFullName,
      userQuery,
      chatTimestamp,
    );

    // Save user query and AI response to the database
    // const newMessage = this.em.create(ChatMessages, {
    //   conversation: conversationId,
    //   user: userId,
    //   message: userQuery,
    //   sender: "user",
    //   timestamp: new Date(),
    // });

    // const aiMessage = this.em.create(ChatMessages, {
    //   conversation: conversationId,
    //   user: userId,
    //   message: aiResponse,
    //   sender: "ai",
    //   timestamp: new Date(),
    // });

    // await this.em.persistAndFlush([newMessage, aiMessage]);

    return aiResponse;
  }
}
