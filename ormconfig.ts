import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// typeorm cli 功能
export function getEnv(env: string): Record<string, unknown> {
  if (fs.existsSync(env)) {
    return dotenv.parse(fs.readFileSync(env));
  }
}

export function buildConnectionOptions() {
  const defaultConfig = getEnv('.env');
  const envConfig = getEnv(`.env.${process.env.NODE_ENV || 'development'}`);

  const config = { ...defaultConfig, ...envConfig };
  return {
    type: config['DATABASE_TYPE'],
    host: config['DATABASE_HOST'],
    port: +config['DATABASE_PORT'],
    username: config['DATABASE_USERNAME'],
    password: config['DATABASE_PASSWORD'],
    database: config['DATABASE_NAME'],
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: Boolean(config['DATABASE_SYNCHRONIZE']),
    autoLoadEntities: Boolean(config['DATABASE_AUTO_LOAD_ENTITIES']),
  } as TypeOrmModuleOptions;
}

export default new DataSource({
  ...buildConnectionOptions(),
} as DataSourceOptions);
