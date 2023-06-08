import { INestApplication } from '@nestjs/common';


export const middleware = (app: INestApplication) => {
    app.setGlobalPrefix('api/v1');
};
