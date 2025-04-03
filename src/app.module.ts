import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from './common/config/config.module'; // 配置模块
import { LoggerModule } from './common/logger/log.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from './entity/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entity/user.schema';
@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    MongooseModule.forRoot('mongodb://root:example@localhost:27017/nest'),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ({
          type: configService.get('DATABASE_TYPE'),
          host: configService.get('DATABASE_HOST'),
          port: +configService.get('DATABASE_PORT'),
          username: configService.get('DATABASE_USERNAME'),
          password: configService.get('DATABASE_PASSWORD'),
          database: configService.get('DATABASE_NAME'),
          autoLoadEntities:
            Boolean(configService.get('DATABASE_AUTO_LOAD_ENTITIES')) || false,
          synchronize:
            Boolean(configService.get('DATABASE_SYNCHRONIZE')) || false,
        }) as TypeOrmModuleOptions,
    }),
    TypeOrmModule.forFeature([User]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
