import { ChatService } from "./chat.service";
import { UserService } from "../user/user.service";
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
} from "@nestjs/common";
import { ChatMessages } from "src/entities/ChatMessages";
import { Conversations } from "src/entities/Conversations";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("chat")
export class ChatController {
  constructor(private readonly ChatService: ChatService, private readonly UserService: UserService) {}

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

  @UseGuards(JwtAuthGuard)
  @Post("conversations/:conversationId/generateChatResponse")
  async generateChatResponse(
    @Request() req,
    @Param("conversationId") conversationId: string,
    @Body("query") query: string, // Extracts 'query' from request body
    @Body("chatTimestamp") chatTimestamp: string // Extracts 'timestamp' from request body
  ): Promise<any> {
    const userFullName = (await this.UserService.getUserById(req.user.userId)).fullName
    // Pass the userId, conversationId, query, and timestamp to the service
    return this.ChatService.generateChatResponse(
      req.user.userId,
      userFullName,
      conversationId,
      query,
      chatTimestamp
    );
  }
}
