import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from './common/config/config.module'; // 配置模块
import { LoggerModule } from './common/logger/log.module';

@Module({
  imports: [ConfigModule, LoggerModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
