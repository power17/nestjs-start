import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma';
import { PRISMA_DATABASE } from '../databse.constants';

@Module({
  imports: [],
  providers: [],
  exports: [],
})
export class PrismaCommonModule {}
