import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// 通过环境变量读取不同的.env文件
export function getEnv(env: string): Record<string, unknown> {
    const filePath = path.resolve(__dirname, env)

    if (fs.existsSync(filePath)) {
        return dotenv.parse(fs.readFileSync(filePath));
    }
    return {};
}

export function getServerConfig() {
    const defaultConfig = getEnv('../../.env');
    const envConfig = getEnv(`../../.env.${process.env.NODE_ENV || 'development'}`);
    // configService
    const config = { ...defaultConfig, ...envConfig };
    return config;
}