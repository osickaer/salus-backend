import { Entity, ManyToOne, type Opt, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { CoreEntity } from './CoreEntity';
import { TrainingSchedules } from './TrainingSchedules';

@Entity()
export class StrengthTrainingSchedules extends CoreEntity {

  [PrimaryKeyProp]?: 'scheduledExerciseId';

  @Property({ type: 'text' })
  exerciseName!: string;

  @ManyToOne({ entity: () => TrainingSchedules, fieldName: 'training_schedule_id', updateRule: 'cascade', deleteRule: 'cascade' })
  trainingSchedule!: TrainingSchedules;

  @PrimaryKey({ type: 'uuid', defaultRaw: `gen_random_uuid()` })
  scheduledExerciseId!: string & Opt;

}
