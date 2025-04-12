import { Injectable, NotFoundException } from "@nestjs/common";
import { EntityManager } from "@mikro-orm/postgresql";
import { Conversations } from "src/entities/Conversations";
import { ChatMessages } from "src/entities/ChatMessages";
import { AiService } from "../ai/ai.service";
import { ChatGraphService } from "../ai/graphs/chat.graph";
import {
  AIMessage,
  SystemMessage,
  HumanMessage,
  BaseMessage,
  isAIMessage,
  isHumanMessage,
  isToolMessage,
  ToolMessage,
  isAIMessageChunk,
} from "@langchain/core/messages";

@Injectable()
export class ChatService {
  constructor(
    private readonly em: EntityManager,
    private readonly aiService: AiService,
    private readonly chatGraphService: ChatGraphService
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
  ): Promise<AsyncGenerator<string>> {
    // Save user query to the database
    // const newMessage = this.em.create(ChatMessages, {
    //   conversation: conversationId,
    //   user: userId,
    //   message: userQuery,
    //   role: "user",
    //   chatTimestamp: new Date(),
    // });
    // await this.em.persistAndFlush(newMessage);

    // function stringMessages(messages: BaseMessage[]) {
    //   let fullmessage = "";
    //   for (const message of messages) {
    //     if (isHumanMessage(message)) {
    //       fullmessage = fullmessage + `User: ${message.content}\n`;
    //       console.log(`User: ${message.content}`);
    //     } else if (isAIMessage(message)) {
    //       const aiMessage = message as AIMessage;
    //       if (aiMessage.content) {
    //         fullmessage = fullmessage + `Assistant: ${aiMessage.content}`;
    //         console.log(`Assistant: ${aiMessage.content}`);
    //       }
    //       if (aiMessage.tool_calls) {
    //         for (const toolCall of aiMessage.tool_calls) {
    //           fullmessage =
    //             fullmessage +
    //             `Tool call: ${toolCall.name}(${JSON.stringify(toolCall.args)})`;
    //           console.log(
    //             `Tool call: ${toolCall.name}(${JSON.stringify(toolCall.args)})`
    //           );
    //         }
    //       }
    //     } else if (isToolMessage(message)) {
    //       const toolMessage = message as ToolMessage;
    //       fullmessage =
    //         fullmessage +
    //         `${toolMessage.name} tool output: ${toolMessage.content}`;
    //       console.log(
    //         `${toolMessage.name} tool output: ${toolMessage.content}`
    //       );
    //     }
    //   }

    //   return fullmessage;
    // }
    // Use the chat graph to generate response
    const stream = await this.chatGraphService.generateResponse(
      userId,
      userFullName,
      userQuery
    );

    // const stringResponse = stringMessages(messages);

    // For development - simple response handling
    // let fullResponse = "";
    // for await (const chunk of response) {
    //   fullResponse += chunk.content;
    // }

    // Save AI response to database
    // const aiMessage = this.em.create(ChatMessages, {
    //   conversation: conversationId,
    //   user: userId,
    //   message: fullResponse,
    //   role: "assistant",
    //   chatTimestamp: new Date(),
    // });
    // await this.em.persistAndFlush(aiMessage);

    // return stringResponse;

    // Streaming code for future use
    const jsonStream = (async function* () {
      let fullResponse = ""; // Track complete response for debugging
      for await (const [message, _metadata] of stream) {
        let jsonChunk = {};
        if (isAIMessageChunk(message) && message.tool_call_chunks?.length) {
          jsonChunk = {
            content: message.tool_call_chunks[0].args,
            chunkSource: "AI_TOOL_CALL",
            timestamp: new Date().toISOString(), // Optional: add timestamp for debugging
          };
        } else {
          jsonChunk = {
            content: message.content,
            chunkSource: "AI",
            timestamp: new Date().toISOString(), // Optional: add timestamp for debugging
          };
          fullResponse += message.content; // Accumulate the response
        }

        yield JSON.stringify(jsonChunk) + "\n";
      }

      // Log complete response at the end
      console.log("\n=== Complete Response ===");
      console.log(fullResponse);
      console.log("======================\n");

      // Save AI response to database
      // const aiMessage = this.em.create(ChatMessages, {
      //   conversation: conversationId,
      //   user: userId,
      //   message: fullResponse,
      //   role: "assistant",
      //   chatTimestamp: new Date(),
      // });
      // await this.em.persistAndFlush(aiMessage);
    })();

    return jsonStream;
  }
}
