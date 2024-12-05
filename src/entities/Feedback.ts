import { Entity, ManyToOne, type Opt, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { Chats } from './Chats';
import { CoreEntity } from './CoreEntity';
import { Users } from './Users';

@Entity()
export class Feedback extends CoreEntity {

  [PrimaryKeyProp]?: 'feedbackId';

  @PrimaryKey({ type: 'bigint', generated: 'by default as identity' })
  feedbackId!: bigint & Opt;

  @Property({ type: 'datetime', defaultRaw: `now()` })
  createdAt!: Date & Opt;

  @Property({ nullable: true })
  liked?: boolean;

  @Property({ type: 'text', nullable: true })
  text?: string;

  @ManyToOne({ entity: () => Chats, fieldName: 'chat_id', nullable: true })
  chat?: Chats;

  @ManyToOne({ entity: () => Users, fieldName: 'user_id', nullable: true })
  user?: Users;

}
