import { Module } from '@nestjs/common';
import { ConfigModule as Config } from '@nestjs/config';
const envFilePath = [`.env.${process.env.NODE_ENV || `development`}`, '.env'];

// 配置模块
@Module({
  imports: [
    Config.forRoot({
      isGlobal: true,
      envFilePath,
    }),
  ],
})
export class ConfigModule {}
