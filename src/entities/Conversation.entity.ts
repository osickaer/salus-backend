import { Entity, ManyToOne, PrimaryKey, Property, OneToMany } from "@mikro-orm/core";
import { User } from "./User.entity";
import { ChatMessage } from "./ChatMessage.entity";

@Entity({ tableName: "conversations" })
export class Conversation {
  @ManyToOne(() => User, { fieldName: "user_id" })
  user!: User; // Foreign key to the `users` table

  @PrimaryKey({ type: "uuid", fieldName: "conversation_id" })
  conversationId!: string;

  @Property({ type: "string" })
  conversationDesc!: string;

  @Property({ type: "timestamp" })
  createdAt!: Date;

  // One-to-Many relationship with UserBodyWeight
  @OneToMany(() => ChatMessage, (chatMessage) => chatMessage.conversation)
  chatMessages = new Array<ChatMessage>();
}
