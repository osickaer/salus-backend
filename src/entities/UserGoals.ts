import { Entity, ManyToOne, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { CoreEntity } from './CoreEntity';
import { Users } from './Users';

@Entity({ comment: 'Nutrition Info, User Info, and Base Fitness Calculations' })
export class UserGoals extends CoreEntity {

  [PrimaryKeyProp]?: ['user', 'goalTimestamp'];

  @ManyToOne({ entity: () => Users, fieldName: 'user_id', updateRule: 'cascade', deleteRule: 'cascade', primary: true })
  user!: Users;

  @Property({ type: 'text', nullable: true })
  measureSys?: string;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  activityFactor?: number;

  @Property({ type: 'smallint', nullable: true })
  surgery?: number;

  @Property({ type: 'smallint', nullable: true })
  trauma?: number;

  @Property({ type: 'smallint', nullable: true })
  burns?: number;

  @Property({ type: 'smallint', nullable: true })
  infection?: number;

  @Property({ nullable: true })
  tdee?: bigint;

  @Property({ type: 'smallint', nullable: true })
  proteinGoal?: number;

  @Property({ type: 'smallint', nullable: true })
  fatGoal?: number;

  @Property({ type: 'smallint', nullable: true })
  carbGoal?: number;

  @Property({ type: 'smallint', nullable: true })
  satFatGoal?: number;

  @Property({ type: 'smallint', nullable: true })
  polyUnsatFatGoal?: number;

  @Property({ type: 'smallint', nullable: true })
  monoSatFatGoal?: number;

  @Property({ type: 'smallint', nullable: true })
  transFatGoal?: number;

  @Property({ type: 'smallint', nullable: true })
  cholesterolGoal?: number;

  @Property({ type: 'smallint', nullable: true })
  sodiumGoal?: number;

  @Property({ type: 'smallint', nullable: true })
  potassiumGoal?: number;

  @Property({ fieldName: 'vit_a_goal', type: 'smallint', nullable: true })
  vitAGoal?: number;

  @Property({ fieldName: 'vit_c_goal', type: 'smallint', nullable: true })
  vitCGoal?: number;

  @Property({ type: 'smallint', nullable: true })
  calciumGoal?: number;

  @Property({ type: 'smallint', nullable: true })
  ironGoal?: number;

  @Property({ type: 'smallint', nullable: true })
  proteinCalsGoal?: number;

  @Property({ type: 'smallint', nullable: true })
  fatCalsGoal?: number;

  @Property({ type: 'smallint', nullable: true })
  carbCalsGoal?: number;

  @PrimaryKey()
  goalTimestamp!: Date;

  @Property({ type: 'smallint', nullable: true })
  calsGoal?: number;

  @Property({ type: 'smallint', nullable: true })
  satFatCalsGoal?: number;

  @Property({ type: 'text', nullable: true })
  weightGoal?: string;

  @Property({ type: 'text', nullable: true })
  bodyGoal?: string;

  @Property({ fieldName: 'vitamin_b1_goal', type: 'float', columnType: 'float4', nullable: true })
  vitaminB1Goal?: number;

  @Property({ fieldName: 'vitamin_b2_goal', type: 'float', columnType: 'float4', nullable: true })
  vitaminB2Goal?: number;

  @Property({ fieldName: 'vitamin_b3_goal', type: 'smallint', nullable: true })
  vitaminB3Goal?: number;

  @Property({ fieldName: 'vitamin_b5_goal', type: 'smallint', nullable: true })
  vitaminB5Goal?: number;

  @Property({ fieldName: 'vitamin_b6_goal', type: 'float', columnType: 'float4', nullable: true })
  vitaminB6Goal?: number;

  @Property({ fieldName: 'vitamin_b12_goal', type: 'float', columnType: 'float4', nullable: true })
  vitaminB12Goal?: number;

  @Property({ type: 'smallint', nullable: true })
  folateGoal?: number;

  @Property({ fieldName: 'vitamin_d_goal', type: 'smallint', nullable: true })
  vitaminDGoal?: number;

  @Property({ fieldName: 'vitamin_e_goal', type: 'smallint', nullable: true })
  vitaminEGoal?: number;

  @Property({ fieldName: 'vitamin_k_goal', type: 'smallint', nullable: true })
  vitaminKGoal?: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  copperGoal?: number;

  @Property({ type: 'smallint', nullable: true })
  magnesiumGoal?: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  manganeseGoal?: number;

  @Property({ type: 'smallint', nullable: true })
  phosphorusGoal?: number;

  @Property({ type: 'smallint', nullable: true })
  seleniumGoal?: number;

  @Property({ type: 'smallint', nullable: true })
  zincGoal?: number;

  @Property({ type: 'smallint', nullable: true })
  fiberGoal?: number;

  @Property({ type: 'smallint', nullable: true })
  sugarGoal?: number;

  @Property({ fieldName: 'omega_3_goal', type: 'float', columnType: 'float4', nullable: true })
  omega3Goal?: number;

  @Property({ fieldName: 'omega_6_goal', type: 'smallint', nullable: true })
  omega6Goal?: number;

  @Property({ type: 'text', nullable: true })
  lifestyleNotes?: string;

  @Property({ type: 'text', nullable: true })
  bodyNotes?: string;

  @Property({ type: 'text', nullable: true })
  weightNotes?: string;

}
