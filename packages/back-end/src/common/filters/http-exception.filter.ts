import { LoggerService } from '@nestjs/common';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    // 响应 请求对象
    const response = ctx.getResponse();
    // const request = Pctx.getRequest();
    // http状态码
    const status = exception.getStatus();
    response.status(status).json({
      code: status,
      // timestamp: new Date().toISOString(),
      // path: request.url,
      // method: request.method,
      message: exception.message || exception.name,
    });
    // throw new Error('Method not implemented.');
  }
}