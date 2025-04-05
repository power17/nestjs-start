import { ModuleMetadata } from '@nestjs/common';
import { ModelDefinition } from './model-definition.interface';

export interface AsyncModelFactory
  extends Pick<ModuleMetadata, 'imports'>,
    Pick<ModelDefinition, 'name' | 'collection' | 'discriminators'> {
  useFactory: (
    ...args: any[]
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  ) => ModelDefinition['schema'] | Promise<ModelDefinition['schema']>;
  inject?: any[];
}
