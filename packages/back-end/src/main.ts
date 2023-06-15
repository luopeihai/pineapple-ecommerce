import { NestFactory } from '@nestjs/core';
import rateLimit from 'express-rate-limit';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { HttpExceptionFilter } from "./common/filters/http-exception.filter"
import { TransformInterceptor } from "./common/interceptors/transform.interceptor"
import { AppModule } from './app.module';
import { getServerConfig } from "./config";
import { ConfigEnum } from "./config/enum"


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  const config = getServerConfig();

  const port = config[ConfigEnum.APP_PORT]


  // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  const nestWinston = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(nestWinston);

  app.setGlobalPrefix('api/v1');
  app.useGlobalFilters(new HttpExceptionFilter(nestWinston.logger));
  // 全局注册拦截器
  app.useGlobalInterceptors(new TransformInterceptor());
  // rateLimit限流
  app.use(
    rateLimit({
      windowMs: 1 * 60 * 1000, // 1 minutes
      max: 300, // limit each IP to 100 requests per windowMs
    }),
  );

  await app.listen(typeof port === 'string' ? parseInt(port) : 3000)

}
bootstrap();
