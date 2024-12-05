import { Entity, type Opt, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { CoreEntity } from './CoreEntity';

@Entity()
export class StrengthExercises extends CoreEntity {

  [PrimaryKeyProp]?: 'strengthExerciseId';

  @Property({ type: 'text' })
  exerciseName!: string;

  @PrimaryKey({ type: 'text' })
  strengthExerciseId: string & Opt = '';

  @Property({ type: 'text', nullable: true })
  force?: string;

  @Property({ type: 'text', nullable: true })
  level?: string;

  @Property({ type: 'text', nullable: true })
  mechanic?: string;

  @Property({ type: 'text', nullable: true })
  equipment?: string;

  @Property({ nullable: true })
  primaryMuscles?: string[];

  @Property({ nullable: true })
  secondaryMuscles?: string[];

  @Property({ nullable: true })
  instructions?: string[];

  @Property({ type: 'text', nullable: true })
  category?: string;

  @Property({ nullable: true })
  images?: string[];

  @Property({ type: 'smallint', nullable: true, defaultRaw: `'5'` })
  priority?: number = NaN;

  @Property({ type: 'text', nullable: true })
  commonName?: string;

}
