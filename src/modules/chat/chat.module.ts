import { Module } from "@nestjs/common";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Conversation } from "src/entities/Conversation.entity";
import { ChatMessage } from "src/entities/ChatMessage.entity";
import { AuthModule } from "../auth/auth.module"; // Import AuthModule

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Conversation, ChatMessage] }), // Register entities
    AuthModule, // Import AuthModule to provide RLSService
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
