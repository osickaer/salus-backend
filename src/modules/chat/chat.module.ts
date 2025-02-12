import { Module } from "@nestjs/common";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { UserService } from "../user/user.service";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Conversations } from "src/entities/Conversations";
import { ChatMessages } from "src/entities/ChatMessages";
import { AuthModule } from "../auth/auth.module"; // Import AuthModule
import { AiModule } from "../ai/ai.module";

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Conversations, ChatMessages] }), // Register entities
    AuthModule, // Import AuthModule to provide RLSService
    AiModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, UserService],
})
export class ChatModule {}
