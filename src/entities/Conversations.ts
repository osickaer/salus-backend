import { Entity, ManyToOne, type Opt, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { CoreEntity } from './CoreEntity';
import { Users } from './Users';

@Entity()
export class Conversations extends CoreEntity {

  [PrimaryKeyProp]?: 'conversationId';

  @Property({ type: 'text' })
  conversationDesc!: string;

  @Property({ type: 'datetime', defaultRaw: `now()` })
  createdAt!: Date & Opt;

  @PrimaryKey({ type: 'uuid', defaultRaw: `gen_random_uuid()` })
  conversationId!: string & Opt;

  @ManyToOne({ entity: () => Users, fieldName: 'user_id', updateRule: 'cascade', deleteRule: 'cascade' })
  user!: Users;

}
