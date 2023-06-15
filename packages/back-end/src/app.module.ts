import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from "nest-winston";
import * as winston from 'winston';
import DailyRotateFile = require("winston-daily-rotate-file");

import { connectionParams } from './config/TypeOrm';
import { UserModule } from './user/user.module';

const format = winston.format;

@Module({
  imports: [TypeOrmModule.forRoot(connectionParams), WinstonModule.forRoot({
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
  }), UserModule]
})
export class AppModule { }


