import { Entity, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { CoreEntity } from './CoreEntity';

@Entity()
export class Users extends CoreEntity {

  [PrimaryKeyProp]?: 'user';

  @PrimaryKey({ fieldName: 'user_id', type: 'uuid', unique: 'users_user_id_key' })
  user!: string;

  @Property({ type: 'text', nullable: true })
  email?: string;

  @Property({ nullable: true })
  joinDate?: Date;

  @Property({ type: 'text', nullable: true })
  fullName?: string;

  @Property({ type: 'date', nullable: true })
  birthdate?: string;

  @Property({ type: 'smallint', nullable: true })
  height?: number;

  @Property({ type: 'text', nullable: true })
  sex?: string;

}
