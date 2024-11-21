import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { User } from "./User.entity";

@Entity({ tableName: "user_body_weights" })
export class UserBodyWeights {
  @ManyToOne(() => User, { fieldName: "user_id", primary: true })
  user!: User; // Foreign key to the `users` table

  @PrimaryKey({ type: "timestamp", fieldName: "weight_timestamp" })
  weightTimestamp!: Date; // Part of composite primary key

  @Property({ type: "integer" })
  weight!: number; // Weight as integer
}
