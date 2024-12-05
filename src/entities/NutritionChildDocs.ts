import { Entity, ManyToOne, type Opt, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { CoreEntity } from './CoreEntity';
import { NutritionParentDocs } from './NutritionParentDocs';

@Entity()
export class NutritionChildDocs extends CoreEntity {

  [PrimaryKeyProp]?: 'childDocId';

  @PrimaryKey({ type: 'uuid', defaultRaw: `gen_random_uuid()` })
  childDocId!: string & Opt;

  @Property({ type: 'text' })
  content!: string;

  @Property({ columnType: 'extensions.vector' })
  embedding!: unknown;

  @Property({ nullable: true, defaultRaw: `now()` })
  createdAt?: Date;

  @ManyToOne({ entity: () => NutritionParentDocs, fieldName: 'parent_doc_id', updateRule: 'cascade', deleteRule: 'cascade', defaultRaw: `gen_random_uuid()` })
  parentDoc!: NutritionParentDocs & Opt;

}
