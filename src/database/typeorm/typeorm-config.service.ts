import { Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { toBoolean } from '@/utils/format';

export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(
    @Inject(REQUEST) private request: Request,
    private configService: ConfigService,
  ) {}

  createTypeOrmOptions(
    connectionName?: string,
  ): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    const headers = this.request.headers;
    const tenantId = headers['x-tenant-id'] || connectionName || 'default';
    let config: any = {
      port: 3306,
    };

    // TODO
    const envConfig = {
      type: this.configService.get('DB_TYPE'),
      host: this.configService.get('DB_HOST'),
      port: this.configService.get('DB_PORT'),
      username: this.configService.get('DB_USERNAME'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_DATABASE'),
      autoLoadEntities: toBoolean(this.configService.get('DB_AUTOLOAD', false)),
      synchronize: toBoolean(this.configService.get('DB_SYNC', false)),
      // 额外的参数
      tenantId,
    };
    if (tenantId === 'typeorm2') {
      config = {
        port: 3307,
      };
    } else if (tenantId === 'typeorm3') {
      config = {
        type: 'postgres',
        port: 5432,
        username: 'pguser',
        database: 'testdb',
      };
    }
    const finalConfig = Object.assign(envConfig, config);
    return finalConfig;
  }
}
