import { Entity, ManyToOne, type Opt, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { CoreEntity } from './CoreEntity';
import { Users } from './Users';

@Entity()
export class Meals extends CoreEntity {

  [PrimaryKeyProp]?: 'mealId';

  @ManyToOne({ entity: () => Users, fieldName: 'user_id', updateRule: 'cascade', deleteRule: 'cascade' })
  user!: Users;

  @Property({ columnType: 'timestamp(6)' })
  mealTimestamp!: Date;

  @Property({ type: 'text' })
  foodDesc!: string;

  @Property()
  ingredients!: string[];

  @Property({ type: 'float', columnType: 'float4' })
  calories!: number;

  @Property({ type: 'float', columnType: 'float4' })
  protein!: number;

  @Property({ type: 'float', columnType: 'float4' })
  totalCarbs!: number;

  @Property({ type: 'float', columnType: 'float4' })
  totalFat!: number;

  @Property({ type: 'float', columnType: 'float4' })
  satFat!: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  polyUnsatFat?: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  monoUnsatFat?: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  transFat?: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  cholesterol?: number;

  @Property({ type: 'float', columnType: 'float4' })
  sodium!: number;

  @Property({ type: 'float', columnType: 'float4' })
  potassium!: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  vitaminA?: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  vitaminC?: number;

  @Property({ type: 'float', columnType: 'float4' })
  calcium!: number;

  @Property({ type: 'float', columnType: 'float4' })
  iron!: number;

  @Property({ type: 'text' })
  mealType!: string;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  vitaminB1?: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  vitaminB2?: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  vitaminB3?: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  vitaminB5?: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  vitaminB6?: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  vitaminB12?: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  folate?: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  vitaminD?: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  vitaminE?: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  vitaminK?: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  copper?: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  magnesium?: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  manganese?: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  phosphorus?: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  selenium?: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  zinc?: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  fiber?: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  fiberSoluble?: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  fiberInsoluble?: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  netCarbs?: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  starch?: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  sugars?: number;

  @Property({ fieldName: 'omega_3', type: 'float', columnType: 'float4', nullable: true })
  omega3?: number;

  @Property({ fieldName: 'omega_6', type: 'float', columnType: 'float4', nullable: true })
  omega6?: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  histidine?: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  isoleucine?: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  leucine?: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  lysine?: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  methionine?: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  phenylalanine?: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  threonine?: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  tryptophan?: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  tyrosine?: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  valine?: number;

  @Property({ type: 'float', columnType: 'float4', nullable: true })
  cystine?: number;

  @PrimaryKey({ type: 'uuid', defaultRaw: `gen_random_uuid()` })
  mealId!: string & Opt;

}
