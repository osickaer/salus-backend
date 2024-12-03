import { ChatService } from "./chat.service";
import { Controller, Get, Param, UseGuards, Request } from "@nestjs/common";
import { ChatMessage } from "src/entities/ChatMessage.entity";
import { Conversation } from "src/entities/Conversation.entity";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("chat")
export class ChatController {
  constructor(private readonly ChatService: ChatService) {}

  // Fetch all conversations for the authenticated user
  @UseGuards(JwtAuthGuard)
  @Get("conversations")
  async getUserConversations(@Request() req): Promise<Conversation[]> {
    // Use userId from the JWT payload attached by JwtAuthGuard
    return this.ChatService.getUserConversations(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get("conversations/:conversationId/chatMessages")
  getConversationChatMessages(
    @Request() req,
    @Param("conversationId") conversationId: string
  ): Promise<ChatMessage[]> {
    return this.ChatService.getConversationChatMessages(
      req.user.userId,
      conversationId
    );
  }
}
