import { Entity, PrimaryKey, Property, OneToMany } from "@mikro-orm/core";
import { UserBodyWeights } from "./UserBodyWeights.entity";

@Entity({ tableName: "users" })
export class User {
  @PrimaryKey({ type: "uuid", fieldName: "user_id" })
  userId!: string;

  @Property({ unique: true })
  email!: string;

  @Property({ type: "timestamp", nullable: true })
  joinDate?: Date;

  @Property({ nullable: true })
  fullName?: string;

  @Property({ type: "date", nullable: true })
  birthdate?: Date;

  @Property({ type: "number", nullable: true })
  height?: number;

  @Property({ nullable: true })
  sex?: string;

  // One-to-Many relationship with UserBodyWeight
  @OneToMany(() => UserBodyWeights, (bodyWeight) => bodyWeight.user)
  bodyWeights = new Array<UserBodyWeights>();
}
