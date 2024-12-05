import { Entity, type Opt, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { CoreEntity } from './CoreEntity';

@Entity()
export class NutritionParentDocs extends CoreEntity {

  [PrimaryKeyProp]?: 'parentDocId';

  @PrimaryKey({ type: 'uuid', defaultRaw: `gen_random_uuid()` })
  parentDocId!: string & Opt;

  @Property({ type: 'datetime', defaultRaw: `now()` })
  createdAt!: Date & Opt;

  @Property({ type: 'text' })
  content!: string;

}
