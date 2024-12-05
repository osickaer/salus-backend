import { Entity, ManyToOne, type Opt, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { CoreEntity } from './CoreEntity';
import { Users } from './Users';

@Entity()
export class TrainingSchedules extends CoreEntity {

  [PrimaryKeyProp]?: 'trainingScheduleId';

  @PrimaryKey({ type: 'uuid', defaultRaw: `gen_random_uuid()` })
  trainingScheduleId!: string & Opt;

  @ManyToOne({ entity: () => Users, fieldName: 'user_id', updateRule: 'cascade', deleteRule: 'cascade' })
  user!: Users;

  @Property({ type: 'text', nullable: true })
  workoutName?: string;

  @Property({ nullable: true })
  isRecurring?: boolean;

  @Property({ type: 'text', nullable: true })
  notes?: string;

  @Property({ type: 'date', nullable: true })
  startDate?: string;

  @Property({ type: 'text', nullable: true })
  workoutType?: string;

}
