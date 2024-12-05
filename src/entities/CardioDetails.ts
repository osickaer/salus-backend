import { Entity, ManyToOne, type Opt, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { CoreEntity } from './CoreEntity';
import { Workouts } from './Workouts';

@Entity()
export class CardioDetails extends CoreEntity {

  [PrimaryKeyProp]?: 'cardioId';

  @PrimaryKey({ type: 'uuid', defaultRaw: `gen_random_uuid()` })
  cardioId!: string & Opt;

  @Property({ type: 'text' })
  cardioExercise!: string;

  @Property({ type: 'text', nullable: true })
  intensity?: string;

  @Property({ nullable: true })
  durationMinutes?: bigint;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  caloriesBurned?: number;

  @ManyToOne({ entity: () => Workouts, fieldName: 'workout_id', updateRule: 'cascade', deleteRule: 'cascade' })
  workout!: Workouts;

}
