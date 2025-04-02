import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import {
  consoleTransports,
  createRotateTransport,
} from './createRotateTransport';
// 日志模块
@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const logOn = config.get('LOG_ON') === 'true';
        return {
          transports: [
            consoleTransports,
            ...(logOn
              ? [
                  createRotateTransport('info', 'application'),
                  createRotateTransport('warn', 'error'),
                ]
              : []),
          ],
        };
      },
    }),
  ],
})
export class LoggerModule {}
