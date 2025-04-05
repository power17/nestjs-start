import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import * as requestIp from 'request-ip';
// 全局异常拦截器
@Catch()
export class AllFilterFilter implements ExceptionFilter {
  private readonly logger = new Logger();
  constructor(private readonly httpAdapter: HttpAdapterHost) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapter;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR; //500
    const msg: unknown = exception['response'] || '服务错误';

    // 响应体
    const responseBody = {
      heads: request.heads,
      query: request.query,
      body: request.body,
      params: request.params,
      timestamp: new Date().toISOString(),
      ip: requestIp.getClientIp(request),
      exception: exception['name'],
      error: msg,
      exceptionObj: exception,
    };
    this.logger.error('logger', responseBody);
    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
