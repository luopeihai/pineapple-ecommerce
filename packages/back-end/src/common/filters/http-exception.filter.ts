import { LoggerService } from '@nestjs/common';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Logger } from "winston";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) { }
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    // 响应 请求对象
    const response = ctx.getResponse();
    // const request = Pctx.getRequest();
    // http状态码
    const status = exception.getStatus();
    const message = exception.message || exception.name
    this.logger.error({ message: [status, message].join('\n') })

    response.status(status).json({
      message,
      code: status
    });
    // throw new Error('Method not implemented.');
  }
}