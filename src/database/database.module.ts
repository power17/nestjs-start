import { Module } from '@nestjs/common';
import { TypeormCommonModule } from './typeorm/typeorm-common.module';
import { PrismaCommonModule } from './prisma/prisma-common.module';
import { MongooseCommonModule } from './mongoose/mongoose-common.module';
import { toBoolean } from '@/utils/format';
import { getEnvs } from '@/utils/get-envs';

const parsedConfig = getEnvs();
// console.log('🚀 ~ parsedConfig:', parsedConfig);
const tenantMode = toBoolean(parsedConfig['TENANT_MODE']);
const tenantDBType = parsedConfig['TENANT_DB_TYPE'].split(',') || [];

const imports = tenantMode
  ? tenantDBType.map((type) => {
      switch (type) {
        case 'typeorm':
          return TypeormCommonModule;
        case 'prisma':
          return PrismaCommonModule;
        case 'mongoose':
          return MongooseCommonModule;
        default:
          return TypeormCommonModule;
      }
    })
  : [PrismaCommonModule];

@Module({
  imports,
  providers: [],
  exports: [],
})
export class DatabaseModule {}
