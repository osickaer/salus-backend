import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

/**
 * Lowest level entity.
 */
export abstract class BaseEntity {

    @PrimaryKey({
        columnType: 'uuid',
        nullable: false,
        defaultRaw: `gen_random_uuid()`,
    })
    id = uuid();

    @Property({ type: 'Date', defaultRaw: `now()` })
    createdAt = new Date();

    @Property({ onUpdate: () => new Date(), type: 'Date', defaultRaw: `now()` })
    updatedAt = new Date();

}
