import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from './common/config/config.module'; // 配置模块
import { LoggerModule } from './common/logger/log.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from './entity/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entity/user.schema';
import { RedisModule } from '@nestjs-modules/ioredis';
// 第三方可选模块
import { ConditionalModule } from './conditional/conditional.module';
// typeorm
import { DatabaseModule } from './database/index.module';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    DatabaseModule,
    TypeOrmModule.forFeature([User]),
    // MongooseModule.forRoot('mongodb://root:example@localhost:27017/nest'),

    // MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    RedisModule.forRoot({
      type: 'single',
      url: 'redis://localhost:6379',
      options: {
        password: '',
      },
    }),
    ConditionalModule.register(),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
