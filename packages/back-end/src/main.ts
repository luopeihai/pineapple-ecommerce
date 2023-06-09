import { NestFactory } from '@nestjs/core';
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

  await app.listen(typeof port === 'string' ? parseInt(port) : 3000)

}
bootstrap();
