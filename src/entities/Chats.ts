import { Entity, ManyToOne, type Opt, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { Conversations } from './Conversations';
import { CoreEntity } from './CoreEntity';
import { Users } from './Users';

@Entity({ comment: 'DO NOT USE' })
export class Chats extends CoreEntity {

  [PrimaryKeyProp]?: 'chatId';

  @PrimaryKey({ type: 'bigint', generated: 'by default as identity' })
  chatId!: bigint & Opt;

  @Property({ columnType: 'timestamp(6)' })
  chatTimestamp!: Date;

  @Property({ type: 'text', nullable: true })
  prompt?: string;

  @ManyToOne({ entity: () => Users, fieldName: 'user_id', updateRule: 'cascade', deleteRule: 'cascade', nullable: true })
  user?: Users;

  @Property({ type: 'text', nullable: true })
  response?: string;

  @Property({ type: 'text', nullable: true })
  category?: string;

  @Property({ nullable: true })
  contextViews?: string[];

  @ManyToOne({ entity: () => Conversations, fieldName: 'conversation_id', updateRule: 'cascade', deleteRule: 'cascade', nullable: true })
  conversation?: Conversations;

}
