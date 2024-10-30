import { EntityManager, MikroORM } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EntityService {
    constructor(
        private readonly orm: MikroORM,
        private readonly em: EntityManager
    ) {}
}
