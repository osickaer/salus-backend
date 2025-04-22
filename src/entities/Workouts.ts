import { Entity, ManyToOne, type Opt, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { CoreEntity } from './CoreEntity';
import { Users } from './Users';

@Entity()
export class Workouts extends CoreEntity {

  [PrimaryKeyProp]?: 'workoutId';

  @PrimaryKey({ type: 'bigint', generated: 'by default as identity' })
  workoutId!: bigint & Opt;

  @ManyToOne({ entity: () => Users, fieldName: 'user_id', updateRule: 'cascade', deleteRule: 'cascade' })
  user!: Users;

  @Property({ type: 'text', nullable: true })
  workoutType?: string;

  @Property({ columnType: 'timestamp(6)', nullable: true })
  workoutDate?: Date;

  @Property({ type: 'text', nullable: true })
  workoutName?: string;

  @Property({ type: 'text', nullable: true })
  workoutNotes?: string;

}
