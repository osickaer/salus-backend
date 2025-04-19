import { Entity, ManyToOne, type Opt, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { Conversations } from './Conversations';
import { CoreEntity } from './CoreEntity';
import { Users } from './Users';

@Entity()
export class ChatMessages extends CoreEntity {

  [PrimaryKeyProp]?: 'chatId';

  @ManyToOne({ entity: () => Users, fieldName: 'user_id', updateRule: 'cascade', deleteRule: 'cascade' })
  user!: Users;

  @Property({ type: 'datetime', defaultRaw: `(now() AT TIME ZONE 'utc'::text)` })
  chatTimestamp!: Date & Opt;

  @Property({ type: 'text' })
  role!: string;

  @Property({ type: 'text', nullable: true })
  content?: string;

  @ManyToOne({ entity: () => Conversations, fieldName: 'conversation_id', updateRule: 'cascade', deleteRule: 'cascade', nullable: true })
  conversation?: Conversations;

  @Property({ type: 'json', columnType: 'json', nullable: true })
  metadata?: any;

  @PrimaryKey({ type: 'text', defaultRaw: `gen_random_uuid()` })
  chatId!: string & Opt;

  @Property({ nullable: true })
  inputTokens?: bigint;

  @Property({ nullable: true })
  outputTokens?: bigint;

}
