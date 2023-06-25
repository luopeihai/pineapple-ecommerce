import { Module, Logger, LoggerService, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from "nest-winston";
import * as winston from 'winston';
import * as dotenv from 'dotenv';
import { RedisModule } from '@nestjs-modules/ioredis';

import DailyRotateFile = require("winston-daily-rotate-file");

import { connectionParams, validationSchema } from './config/TypeOrm';
import { ConfigEnum } from './config/enum';

import { UserModule } from './user/user.module';
import { AuthModule } from "./auth/auth.module";
import { RolesModule } from './roles/roles.module';
const envFilePath = `.env.${process.env.NODE_ENV || `development`}`;

const format = winston.format;

Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      // https://github.com/nestjs/config/issues/209#issuecomment-625765057
      // load方法需要自己加入验证
      // 解决方法：https://dev.to/rrgt19/ways-to-validate-environment-configuration-in-a-forfeature-config-in-nestjs-2ehp
      load: [
        () => {
          const values = dotenv.config({ path: '.env' });
          const { error } = validationSchema.validate(values?.parsed, {
            // 允许未知的环境变量
            allowUnknown: true,
            // 如果有错误，不要立即停止，而是收集所有错误
            abortEarly: false,
          });
          if (error) {
            throw new Error(
              `Validation failed - Is there an environment variable missing?
        ${error.message}`,
            );
          }
          return values;
        },
      ],
      validationSchema,
    }),
    // Redis集成
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService, logger: LoggerService) => {
        const host = configService.get(ConfigEnum.REDIS_HOST);
        const port = configService.get(ConfigEnum.REDIS_PORT);
        const password = configService.get(ConfigEnum.REDIS_PASSWORD);
        const url = password
          ? `redis://${password}@${host}:${port}`
          : `redis://${host}:${port}`;

        return {
          config: {
            url,
            reconnectOnError: (err) => {
              logger.error(`Redis Connection error: ${err}`);
              return true;
            },
          },
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forRoot(connectionParams),
    WinstonModule.forRoot({
      exitOnError: false,
      format: format.combine(
        format.colorize(),
        format.timestamp({
          format: 'HH:mm:ss YY/MM/DD'
        }),
        format.label({
          label: "fat"
        }),
        format.splat(),
        format.printf(info => {
          return `${info.timestamp} ${info.level}: [${info.label}]${info.message}`
        }),
      ),
      transports: [
        new winston.transports.Console({
          level: 'info',
        }),
        new DailyRotateFile({
          filename: 'logs/application-%DATE%.log',
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),

      ],
    }),
    UserModule,
    AuthModule,
    RolesModule
  ],
  controllers: [],
  providers: [
    Logger,
    // {
    //   provide: APP_GUARD,
    //   useClass: AdminGuard,
    // },
  ],
  exports: [Logger],
})
export class AppModule { }


