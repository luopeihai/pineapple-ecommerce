import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as Joi from 'joi';
import { getServerConfig } from "./index"
import { ConfigEnum } from "./enum"

export const connectionParams = buildConnectionOptions();

export function buildConnectionOptions() {
    // configService
    const config = getServerConfig()

    const logFlag = config[ConfigEnum.LOG_ON] === 'true';

    const entitiesDir =
        process.env.NODE_ENV === 'test'
            ? [process.cwd() + '/**/*.entity.ts']
            : [process.cwd() + '/dist/**/*.entity{.js,.ts}'];

    return {
        type: config[ConfigEnum.DB_TYPE],
        host: config[ConfigEnum.DB_HOST],
        port: config[ConfigEnum.DB_PORT],
        username: config[ConfigEnum.DB_USERNAME],
        password: config[ConfigEnum.DB_PASSWORD],
        database: config[ConfigEnum.DB_DATABASE],
        entities: entitiesDir,
        // 同步本地的schema与数据库 -> 初始化的时候去使用
        synchronize: true,
        logging: logFlag && process.env.NODE_ENV === 'development',
        // logging: false,
    } as TypeOrmModuleOptions;
}


export const validationSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development'),
    DB_PORT: Joi.number().default(3306),
    DB_HOST: Joi.alternatives().try(Joi.string().ip(), Joi.string().domain()),
    DB_TYPE: Joi.string().valid('mysql', 'postgres'),
    DB_DATABASE: Joi.string().required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_SYNC: Joi.boolean().default(false),
    LOG_ON: Joi.boolean(),
    LOG_LEVEL: Joi.string(),
});

export default new DataSource({
    ...connectionParams,
    // migrations: ['./dist/src/migrations/**'],
    subscribers: [],
} as DataSourceOptions);