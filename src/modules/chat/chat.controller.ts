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
  Res,
} from "@nestjs/common";
import { ChatMessages } from "src/entities/ChatMessages";
import { Conversations } from "src/entities/Conversations";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Response } from "express";

@Controller("chat")
export class ChatController {
  constructor(
    private readonly ChatService: ChatService,
    private readonly UserService: UserService
  ) {}

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
    @Res() response: Response,
    @Param("conversationId") conversationId: string,
    @Body("query") query: string,
    @Body("chatTimestamp") chatTimestamp: string
  ): Promise<void> {
    response.setHeader("Content-Type", "text/event-stream");
    response.setHeader("Cache-Control", "no-cache");
    response.setHeader("Connection", "keep-alive");

    const userFullName = (await this.UserService.getUserById(req.user.userId))
      .fullName;

    try {
      const stream = await this.ChatService.generateChatResponse(
        req.user.userId,
        userFullName,
        conversationId,
        query,
        chatTimestamp
      );

      for await (const chunk of stream) {
        response.write(`data: ${JSON.stringify(chunk)}\n\n`);
      }
    } catch (error) {
      response.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    } finally {
      response.end();
    }
  }
}
