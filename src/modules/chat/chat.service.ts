import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Conversation } from 'src/entities/Conversation.entity';
import { ChatMessage } from 'src/entities/ChatMessage.entity';

@Injectable()
export class ChatService {
    constructor(private readonly em: EntityManager) {}
    async getUserConversations(userId: string): Promise<Conversation[]> {
        const conversations = await this.em.find(
            Conversation,
            { user: {userId} },
            {
                orderBy: { createdAt: "DESC" },
                limit: 7
            }
        );

        // If no conversations are found, return an empty array
        if (!conversations || conversations.length === 0) {
            return []; // Graceful handling for new users
        }
        return conversations
    }

    async getConversationChatMessages(conversationId: string): Promise<ChatMessage[]> {
        const chatMessages = await this.em.find(
            ChatMessage,
            { conversation: {conversationId} },
            {
                orderBy: { chatTimestamp: "DESC" }
            }
        );

        // If no conversations are found, return an empty array
        if (!chatMessages || chatMessages.length === 0) {
            return []; // Graceful handling for new users
        }
        return chatMessages
    }
}
