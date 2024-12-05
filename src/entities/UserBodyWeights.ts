import { Entity, ManyToOne, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { CoreEntity } from './CoreEntity';
import { Users } from './Users';

@Entity()
export class UserBodyWeights extends CoreEntity {

  [PrimaryKeyProp]?: ['user', 'weightTimestamp'];

  @ManyToOne({ entity: () => Users, fieldName: 'user_id', updateRule: 'cascade', deleteRule: 'cascade', primary: true })
  user!: Users;

  @PrimaryKey({ columnType: 'timestamp(6)' })
  weightTimestamp!: Date;

  @Property()
  weight!: number;

}
