import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { CoreEntity } from './CoreEntity';

@Entity()
@Unique({ name: 'profile_id_fcm_token_key', properties: ['id', 'fcmToken'] })
export class Profiles extends CoreEntity {

  @PrimaryKey({ type: 'uuid' })
  id!: string;

  @Property({ type: 'text', nullable: true })
  fcmToken?: string;

}
