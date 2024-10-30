import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';
import { BaseEntity } from './BaseEntity.entity';

/**
 * Lowest level entity.
 */


export type SexEnum = "Male" | "Female" | "Other"

@Entity()
export class User extends BaseEntity {

    @Property({unique: true })
    email!: string

    @Property()
    fullName!: string

    @Property()
    birthdate!: Date

    @Property({})
    height!: number

    @Property()
    sex!: SexEnum

}
