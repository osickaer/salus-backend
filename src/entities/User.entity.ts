import { Entity, PrimaryKey, Property, OneToMany } from "@mikro-orm/core";
import { UserBodyWeight } from "./UserBodyWeight.entity";
import { Conversation } from "./Conversation.entity";
import { ChatMessage } from "./ChatMessage.entity";

@Entity({ tableName: "users" })
export class User {
  @PrimaryKey({ type: "uuid", fieldName: "user_id" })
  userId!: string;

  @Property({ unique: true })
  email!: string;

  @Property({ type: "timestamp", nullable: true })
  joinDate?: Date;

  @Property({ nullable: true })
  fullName?: string;

  @Property({ type: "date", nullable: true })
  birthdate?: Date;

  @Property({ type: "number", nullable: true })
  height?: number;

  @Property({ nullable: true })
  sex?: string;

  // One-to-Many relationship with UserBodyWeight
  @OneToMany(() => UserBodyWeight, (bodyWeight) => bodyWeight.user)
  bodyWeights = new Array<UserBodyWeight>();

  // One-to-Many relationship with Conversations
  @OneToMany(() => Conversation, (conversation) => conversation.user)
  conversations = new Array<Conversation>();

  // One-to-Many relationship with Conversations
  @OneToMany(() => ChatMessage, (chatMessage) => chatMessage.user)
  chatMessages = new Array<ChatMessage>();
}
