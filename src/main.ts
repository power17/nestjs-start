import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: ['warn', 'error'], //日志
  });
  app.setGlobalPrefix('api/v1');
  // 从env文件中读取port
  const configService = app.get(ConfigService);
  const port = configService.get('PORT', 3000);
  // 使用winston实例
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  await app.listen(port);
}
bootstrap();
