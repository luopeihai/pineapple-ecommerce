import { NestFactory } from '@nestjs/core';
import rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';
import { getServerConfig } from "./config";
import { ConfigEnum } from "./config/enum"


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  const config = getServerConfig();

  const port = config[ConfigEnum.APP_PORT]
  app.setGlobalPrefix('api/v1');
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
