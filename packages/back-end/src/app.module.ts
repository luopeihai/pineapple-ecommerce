import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { connectionParams } from './config/TypeOrm';
import { UserModule } from './user/user.module';

@Module({
  imports: [TypeOrmModule.forRoot(connectionParams), UserModule]
})
export class AppModule { }
