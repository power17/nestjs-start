import { Global, Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserTypeormRepository } from './repository/user.typeorm.repository';

// import { UserSchema } from './user.schema';
import { UserRepository } from './service/user.repository';
import { UserController } from './user.controller';

import { getEnvs } from '@/utils/get-envs';
import { toBoolean } from '@/utils/toBoolean';
import { RoleModule } from '@/access-control/role/role.module';
// import { PolicyModule } from '@/access-control/policy/policy.module';
// import { PermissionModule } from '@/access-control/permission/permission.module';

@Global()
@Module({
  imports: [RoleModule, TypeOrmModule.forFeature([User])],
  providers: [UserTypeormRepository, UserRepository],
  exports: [UserRepository],
  controllers: [UserController],
})
export class UserModule {}
