import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AllFilterFilter } from './common/filter/all-filter.filter';
import { VERSION_NEUTRAL, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: ['warn', 'error'], //日志
  });
  // 从env文件中读取port
  const configService = app.get(ConfigService);
  const port = configService.get('PORT', 3000);
  const prefix = configService.get('PREFIX');
  const version = configService.get('VERSION');
  // 全局prefix
  app.setGlobalPrefix(prefix);
  // 版本控制
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: version || VERSION_NEUTRAL, // 默认不做版本控制
  });

  // 使用winston实例
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  // 全局异常拦截器
  app.useGlobalFilters(new AllFilterFilter(app.get(HttpAdapterHost))); // HttpAdapterHostHttpAdapterHost 来访问底层 HTTP 服务器的实例，以便处理异常和发送响应

  await app.listen(port);
}
bootstrap();
