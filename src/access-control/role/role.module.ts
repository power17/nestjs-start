import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { PrismaClient } from 'prisma/clients/mysql';

@Module({
  controllers: [RoleController],
  providers: [
    RoleService,
    {
      provide: 'PRISMA_DATABASE',
      useValue: new PrismaClient(),
    },
  ],
  exports: [RoleService],
})
export class RoleModule {}
