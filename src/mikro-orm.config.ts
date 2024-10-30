import { defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { EntityGenerator } from '@mikro-orm/entity-generator';
import { SeedManager } from '@mikro-orm/seeder';
import { Migrator } from '@mikro-orm/migrations';
import * as dotenv from 'dotenv';
import { MikroORM, Utils } from '@mikro-orm/core';
dotenv.config();

export default defineConfig({
  entities: ['./dist/entities/**/*.js'],
  entitiesTs: ['./src/entities/**/*.ts'],
  clientUrl: process.env.DATA_CONNECTION as string,
  metadataProvider: TsMorphMetadataProvider,
  extensions: [EntityGenerator, SeedManager, Migrator],
  migrations: {
    tableName: 'mikro_orm_migrations',
    path: Utils.detectTsNode() ? 'src/migrations' : 'dist/migrations',
  },
  schemaGenerator: {
    ignoreSchema: [
      // allows ignoring some schemas when diffing
      'auth',
      'realtime',
      'vault',
      'supabase_migrations',
      'net',
      'supabase_functions',
      'storage',
      'cron',
      '_analytics',
      '_realtime',
    ],
    disableForeignKeys: false,
    createForeignKeyConstraints: true,
  },
  // debug: true,
  entityGenerator: {
    schema: 'public',
    customBaseEntityName: 'CoreEntity',
  },
  // applies a global tenant filter to all requests for all entities
  // filters: {
  //   tenant: {
  //     cond: args => ({ tenant: args.tenant }),
  //   }
  // },
  seeder: {
    path: './dist/seeders', // path to the folder with seeders
    pathTs: './src/seeders', // path to the folder with TS seeders (if used, we should put path to compiled files in `path`)
    defaultSeeder: 'DatabaseSeeder', // default seeder class name
    glob: '!(*.d).{js,ts}', // how to match seeder files (all .js and .ts files, but not .d.ts)
    emit: 'ts', // seeder generation mode
    fileName: (className: string) => className,
  },
});
