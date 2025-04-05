import { Global, Module } from '@nestjs/common';

import { TYPEORM_DATABASE } from '@/database/databse.constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserTypeormRepository } from './repository/user.typeorm.repository';

import { UserPrismaRepository } from './repository/user.prisma.repository';

import { MongooseModule } from '../database/mongoose/mongoose.module';
import { UserMongooseRepository } from './repository/user.mongoose.repository';
import { UserSchema } from './user.schema';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { getEnvs } from '@/utils/get-envs';
import { toBoolean } from '@/utils/format';
import { RoleModule } from '@/access-control/role/role.module';
import { PolicyModule } from '@/access-control/policy/policy.module';
import { PermissionModule } from '@/access-control/permission/permission.module';

const parsedConfig = getEnvs();
const tenantMode = toBoolean(parsedConfig['TENANT_MODE']);
const tenantDBType = parsedConfig['TENANT_DB_TYPE'].split(',') || [];

const imports = tenantMode
  ? tenantDBType
      .map((type) => {
        switch (type) {
          case 'typeorm':
            return TypeOrmModule.forFeature([User], TYPEORM_DATABASE);
          case 'mongoose':
            return MongooseModule.forFeature([
              { name: 'User', schema: UserSchema },
            ]);
          default:
            return undefined;
        }
      })
      .filter((item) => item !== undefined)
  : [];

const providers = tenantMode
  ? tenantDBType.map((type) => {
      switch (type) {
        case 'typeorm':
          return UserTypeormRepository;
        case 'prisma':
          return UserPrismaRepository;
        case 'mongoose':
          return UserMongooseRepository;
      }
    })
  : [UserPrismaRepository];

@Global()
@Module({
  imports: [...imports, RoleModule, PolicyModule, PermissionModule],
  providers: [...providers, UserRepository],
  exports: [UserRepository],
  controllers: [UserController],
})
export class UserModule {}
