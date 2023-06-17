import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import {
  Body,
  Controller,
  Post,
  // HttpException,
  UseFilters,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninUserDto } from './dto/signin-user.dto';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private authService: AuthService,
    // @ts-expect-error
    @InjectRedis() private readonly redis: Redis,
  ) { }

  @Get()
  getHello(): string {
    return 'Hello World!';
  }

  @Post('/signin')
  async signin(@Body() dto: SigninUserDto) {
    const { username, password } = dto;
    const token = await this.authService.signin(username, password);
    // 设置token
    await this.redis.set(username, token);
    return {
      access_token: token,
    };
  }

  // @Post('/signup')
  // // @UseInterceptors(SerializeInterceptor)
  // signup(@Body() dto: SigninUserDto) {
  //   const { username, password } = dto;
  //   // if (!username || !password) {
  //   //   throw new HttpException('用户名或密码不能为空', 400);
  //   // }
  //   // // 正则 -> todo
  //   // if (typeof username !== 'string' || typeof password !== 'string') {
  //   //   throw new HttpException('用户名或密码格式不正确', 400);
  //   // }
  //   // if (
  //   //   !(typeof username == 'string' && username.length >= 6) ||
  //   //   !(typeof password === 'string' && password.length >= 6)
  //   // ) {
  //   //   throw new HttpException('用户名密码必须长度超过6', 400);
  //   // }
  //   return this.authService.signup(username, password);
  // }
}
