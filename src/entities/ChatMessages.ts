import { Entity, ManyToOne, type Opt, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { Conversations } from './Conversations';
import { CoreEntity } from './CoreEntity';
import { Users } from './Users';

@Entity()
export class ChatMessages extends CoreEntity {

  [PrimaryKeyProp]?: 'chatId';

  @PrimaryKey({ type: 'bigint', generated: 'by default as identity' })
  chatId!: bigint & Opt;

  @ManyToOne({ entity: () => Users, fieldName: 'user_id', updateRule: 'cascade', deleteRule: 'cascade' })
  user!: Users;

  @Property({ columnType: 'timestamp(6)' })
  chatTimestamp!: Date;

  @Property({ type: 'text' })
  role!: string;

  @Property({ type: 'text', nullable: true })
  message?: string;

  @Property({ nullable: true })
  contextViews?: string[];

  @ManyToOne({ entity: () => Conversations, fieldName: 'conversation_id', updateRule: 'cascade', deleteRule: 'cascade', nullable: true })
  conversation?: Conversations;

}
