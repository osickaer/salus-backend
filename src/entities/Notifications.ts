import { Entity, type Opt, PrimaryKey, Property } from '@mikro-orm/core';
import { CoreEntity } from './CoreEntity';

@Entity()
export class Notifications extends CoreEntity {

  @PrimaryKey({ type: 'uuid', defaultRaw: `gen_random_uuid()` })
  id!: string & Opt;

  @Property({ fieldName: 'user_id', type: 'uuid' })
  user!: string;

  @Property({ type: 'datetime', defaultRaw: `now()` })
  createdAt!: Date & Opt;

  @Property({ type: 'text' })
  body!: string;

}
