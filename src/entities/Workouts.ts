import {
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  PrimaryKeyProp,
  Property,
  Collection,
} from "@mikro-orm/core";
import { CoreEntity } from "./CoreEntity";
import { Users } from "./Users";
import { StrengthTrainingDetails } from "./StrengthTrainingDetails";
import { type Opt } from "@mikro-orm/core"; // Import for `Opt` type

@Entity()
export class Workouts extends CoreEntity {
  [PrimaryKeyProp]?: "workoutId";

  @PrimaryKey({ type: "bigint", generated: "by default as identity" })
  workoutId!: bigint & Opt;

  @ManyToOne({
    entity: () => Users,
    fieldName: "user_id",
    updateRule: "cascade",
    deleteRule: "cascade",
  })
  user!: Users;

  @Property({ type: "text", nullable: true })
  workoutType?: string;

  @Property({ columnType: "timestamp(6)", nullable: true })
  workoutDate?: Date;

  @Property({ type: "text", nullable: true })
  workoutName?: string;

  @Property({ type: "text", nullable: true })
  workoutNotes?: string;

  @OneToMany(() => StrengthTrainingDetails, (details) => details.workout)
  strengthTrainingDetails = new Collection<StrengthTrainingDetails>(this); // Establish relationship
}
