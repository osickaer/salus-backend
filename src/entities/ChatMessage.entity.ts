import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Conversation } from "./Conversation.entity";
import { User } from "./User.entity";

@Entity({ tableName: "chat_messages" })
export class ChatMessage {
  @ManyToOne(() => Conversation, { fieldName: "conversation_id" })
  conversation!: Conversation; // Foreign key to the `conversations` table

  @ManyToOne(() => User, { fieldName: "user_id" })
  user!: User; // Foreign key to the `users` table

  @PrimaryKey({ type: "integer", fieldName: "chat_id" })
  chatId!: number;

  @Property({ type: "timestamp" })
  chatTimestamp!: Date;

  @Property({ type: "string" })
  role!: string;

  @Property({ type: "string" })
  message!: string;

  @Property({ type: "json" })
  contextViews!: string[];

}
