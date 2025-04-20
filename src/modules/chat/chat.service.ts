import { Injectable, NotFoundException } from "@nestjs/common";
import { EntityManager } from "@mikro-orm/postgresql";
import { Conversations } from "src/entities/Conversations";
import { ChatMessages } from "src/entities/ChatMessages";
import { AiService } from "../ai/ai.service";
import { ChatGraphService } from "../ai/graphs/chat.graph";
import {
  AIMessageChunk,
  AIMessage,
  SystemMessage,
  HumanMessage,
  BaseMessage,
  isAIMessage,
  isHumanMessage,
  isToolMessage,
  ToolMessage,
  isAIMessageChunk,
  trimMessages,
  BaseMessageChunk,
  isToolMessageChunk,
} from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { concat } from "@langchain/core/utils/stream";
import { appendFileSync } from "fs";
import { v4 as uuidv4 } from "uuid";
import { Users } from "src/entities/Users";

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
    userQuery: string
  ): Promise<AsyncGenerator<string>> {
    const conversationMessages = await this.getConversationChatMessages(
      userId,
      conversationId
    );
    const lcMessages = this.transformToLangChainMessages(conversationMessages);
    const trimmedMessages = await trimMessages(lcMessages, {
      maxTokens: 3000,
      strategy: "last",
      tokenCounter: new ChatOpenAI({ modelName: "gpt-4" }),
      startOn: "human",
    });
    const inputMessages = [...trimmedMessages, new HumanMessage(userQuery)];

    appendFileSync(
      "chunk-debug.log",
      JSON.stringify(inputMessages, null, 2) + "\n"
    );

    const stream = await this.chatGraphService.generateResponse(
      userId,
      userFullName,
      inputMessages
    );

    return this.handleGraphStream(stream, conversationId, userId, userQuery);
  }

  private async *handleGraphStream(
    stream: AsyncIterable<any>,
    conversationId: string,
    userId: string,
    userQuery: string
  ): AsyncGenerator<string> {
    let fullResponse = "";
    const messagesToInsert: ChatMessages[] = [];

    // Add the user's query message first
    messagesToInsert.push({
      chatId: uuidv4(),
      user: this.em.getReference(Users, userId),
      conversation: this.em.getReference(Conversations, conversationId),
      role: "user",
      chatTimestamp: new Date(),
      content: userQuery,
    });

    for await (const chunk of stream) {
      const chunkType = chunk[0];
      const chunkMessage = chunk[1][0];

      // Handles streaming the tokens to the frontend
      if (chunkType === "messages") {
        const result = this.handleMessageChunk(chunkMessage, conversationId);
        fullResponse += chunkMessage.content;
        yield result;
      }
      // Handles gathering the message sto update in the db
      else if (chunkType === "updates") {
        const updateMessages = this.handleUpdateChunk(
          chunk[1],
          conversationId,
          userId
        );
        messagesToInsert.push(...updateMessages);
      }
    }

    // Insert all collected messages after streaming is complete
    if (messagesToInsert.length > 0) {
      await this.insertMessages(messagesToInsert);
    }

    console.log("\n=== Complete Response ===");
    console.log(fullResponse);
    console.log("======================\n");
  }

  private async insertMessages(messages: any[]) {
    for (const message of messages) {
      const chatMessage = this.em.create(ChatMessages, message);
      await this.em.persistAndFlush(chatMessage);
    }
  }

  private handleUpdateChunk(
    chunkValue: any,
    conversationId: string,
    userId: string
  ): ChatMessages[] {
    const newMessages = [] as ChatMessages[];
    // appendFileSync(
    //   "chunk-debug.log",
    //   JSON.stringify(chunkValue, null, 2) + "\n"
    // );
    for (const [node, values] of Object.entries(chunkValue)) {
      if (
        (node == "toolCaller" || node == "chat") &&
        "messages" in (values as object)
      ) {
        const messages = values["messages"] as AIMessage[];
        const message = messages[0];
        let newMessage = {
          chatId: uuidv4(),
          user: this.em.getReference(Users, userId),
          conversation: this.em.getReference(Conversations, conversationId),
          content: message.content ? String(message.content) : null,
          chatTimestamp: new Date(),
          inputTokens: BigInt(message.usage_metadata.input_tokens || 0),
          outputTokens: BigInt(message.usage_metadata.output_tokens || 0),
        };
        if (message.tool_calls?.length > 0) {
          const metadata = {
            id: message.id,
            tool_calls: message.tool_calls,
          };
          newMessages.push({
            role: "tool_call",
            metadata: metadata,
            ...newMessage,
          });
        } else {
          newMessages.push({
            role: "assistant",
            ...newMessage,
          });
        }
      } else if (node == "toolExecutor" && "messages" in (values as object)) {
        const messages = values["messages"] as ToolMessage[];
        for (const message of messages) {
          const metadata = {
            tool_call_id: message.tool_call_id,
            name: message.name,
          };
          newMessages.push({
            role: "tool_message",
            chatId: uuidv4(),
            user: this.em.getReference(Users, userId),
            conversation: this.em.getReference(Conversations, conversationId),
            content: message.content ? String(message.content) : null,
            chatTimestamp: new Date(),
            metadata: metadata,
          });
        }
      }
    }
    return newMessages;
  }

  private handleMessageChunk(
    chunkMessage: BaseMessageChunk | BaseMessage,
    conversationId: string
  ): string {
    // appendFileSync(
    //   "chunk-debug.log",
    //   JSON.stringify(chunkMessage, null, 2) + "\n\n"
    // );
    let jsonChunk = {};
    if (
      chunkMessage instanceof BaseMessageChunk &&
      isAIMessageChunk(chunkMessage) &&
      chunkMessage.tool_call_chunks?.length == 0
    ) {
      jsonChunk = {
        conversationId: conversationId,
        role: "assistant",
        message: chunkMessage.content,
        chatTimestamp: new Date().toISOString(),
      };
    } else if (
      chunkMessage instanceof BaseMessageChunk &&
      isAIMessageChunk(chunkMessage) &&
      chunkMessage.tool_calls?.length > 0
    ) {
      jsonChunk = {
        conversationId: conversationId,
        role: "tool_call",
        message: chunkMessage.tool_calls,
        chatTimestamp: new Date().toISOString(),
      };
    } else if (isToolMessage(chunkMessage)) {
      jsonChunk = {
        conversationId: conversationId,
        role: "tool_message",
        message: chunkMessage.content.toString(),
        chatTimestamp: new Date().toISOString(),
      };
    } else {
      jsonChunk = {
        conversationId: conversationId,
        role: "unknown",
        message: "",
        chatTimestamp: new Date().toISOString(),
      };
    }
    return JSON.stringify(jsonChunk);
  }

  private transformToLangChainMessages(
    chatMessages: ChatMessages[]
  ): BaseMessage[] {
    return chatMessages.map((msg) => {
      if (msg.role === "user") {
        return new HumanMessage(msg.content || "");
      } else if (msg.role === "assistant") {
        return new AIMessage({
          content: msg.content || "",
          id: msg.chatId,
        });
      } else if (msg.role === "tool_call") {
        return new AIMessage({
          content: msg.content || "",
          id: msg.chatId,
          tool_calls: msg.metadata.tool_calls,
        });
      } else if (msg.role === "tool_message") {
        return new ToolMessage({
          content: msg.content || "",
          tool_call_id: msg.metadata.tool_call_id,
          name: msg.metadata.name,
        });
      }
      // // Default to HumanMessage if role is unknown
      // return new HumanMessage(msg.message || "");
    });
  }
}
