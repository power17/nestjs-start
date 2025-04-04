import { Module } from '@nestjs/common';
import { TypeormCommonModule } from './typeorm/ typeorm.module';

@Module({
  imports: [TypeormCommonModule],
  providers: [],
  exports: [],
})
export class DatabaseModule {}
