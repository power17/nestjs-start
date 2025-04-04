import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { ConfigService } from '@nestjs/config';
import { toBoolean } from '@/utils/toBoolean';

const connections = new Map<string, DataSource>();

@Module({
  imports: [
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
            toBoolean(configService.get('DATABASE_AUTO_LOAD_ENTITIES')) ||
            false,
          synchronize:
            toBoolean(configService.get('DATABASE_SYNCHRONIZE')) || false,
        }) as TypeOrmModuleOptions,
    }),
  ],
  // providers: [
  //   TypeormProvider,
  //   {
  //     provide: TYPEORM_CONNECTIONS,
  //     useValue: connections,
  //   },
  // ],
})
export class TypeormCommonModule {}
