import { Entity, ManyToOne, type Opt, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { CoreEntity } from './CoreEntity';
import { Workouts } from './Workouts';

@Entity()
export class StrengthTrainingDetails extends CoreEntity {

  [PrimaryKeyProp]?: 'exerciseId';

  @PrimaryKey({ type: 'bigint', generated: 'by default as identity' })
  exerciseId!: bigint & Opt;

  @ManyToOne({ entity: () => Workouts, fieldName: 'workout_id', updateRule: 'cascade', deleteRule: 'cascade' })
  workout!: Workouts;

  @Property({ type: 'text' })
  exerciseName!: string;

  @Property({ type: 'smallint' })
  setNum!: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  reps?: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  weight?: number;

}
