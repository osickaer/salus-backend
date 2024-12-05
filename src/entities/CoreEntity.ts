import { Config, type DefineConfig } from '@mikro-orm/core';

export abstract class CoreEntity {

  [Config]?: DefineConfig<{ forceObject: false }>;

}
