import { ChatService } from './chat.service';
import { Controller, Get, Param } from '@nestjs/common';
import { ChatMessage } from 'src/entities/ChatMessage.entity';
import { Conversation } from 'src/entities/Conversation.entity';

@Controller('chat')
export class ChatController {
    constructor(private readonly ChatService: ChatService) {}

    @Get(':userId/conversations')
    getUserConversations(@Param("userId") userId: string): Promise<Conversation[]> {
        return this.ChatService.getUserConversations(userId);
    }

    @Get('conversations/:conversationId/chatMessages')
    getConversationChatMessages(
        @Param("conversationId") conversationId: string
    ): Promise<ChatMessage[]> {
        return this.ChatService.getConversationChatMessages(conversationId);
    }
}
