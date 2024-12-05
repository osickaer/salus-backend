import { ChatService } from "./chat.service";
import { Controller, Get, Param, UseGuards, Request } from "@nestjs/common";
import { ChatMessages } from "src/entities/ChatMessages";
import { Conversations } from "src/entities/Conversations";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("chat")
export class ChatController {
  constructor(private readonly ChatService: ChatService) {}

  // Fetch all conversations for the authenticated user
  @UseGuards(JwtAuthGuard)
  @Get("conversations")
  async getUserConversations(@Request() req): Promise<Conversations[]> {
    // Use userId from the JWT payload attached by JwtAuthGuard
    return this.ChatService.getUserConversations(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get("conversations/:conversationId/chatMessages")
  getConversationChatMessages(
    @Request() req,
    @Param("conversationId") conversationId: string
  ): Promise<ChatMessages[]> {
    return this.ChatService.getConversationChatMessages(
      req.user.userId,
      conversationId
    );
  }
}
