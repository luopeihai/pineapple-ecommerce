import {
  Controller,
  Get,
  Post,
  Body,
  UseFilters,
  Delete,
  Param,
  Query
} from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service'
import { CreateUserDto } from "./dto/create-user.dto"
import { getUserDto } from './dto/get-user.dto';
import { CreateUserPipe } from "./pipes/create-user.pipe"
import { Serialize } from '../common/decorators/serialize.decorator';
import { PublicUserDto } from './dto/public-user.dto';
import { TypeormFilter } from "../common/filters/typeorm.filter"

@Controller('user')
@UseFilters(new TypeormFilter())

export class UserController {
  // private logger = new Logger(UserController.name);

  constructor(
    private userService: UserService
  ) {
    // this.logger.log('UserController init');
  }

  @Get()
  @Serialize(PublicUserDto)
  getUsers(@Query() query: getUserDto): any {
    // page - 页码，limit - 每页条数，condition-查询条件(username, role, gender)，sort-排序
    // 前端传递的Query参数全是string类型，需要转换成number类型
    return this.userService.findAll(query);
  }


  @Get('/:id')
  getUser(): any {
    return 'hello world';
    // return this.userService.getUsers();
  }


  @Post()
  @Serialize(PublicUserDto)
  addUser(@Body(CreateUserPipe) dto: CreateUserDto): any {
    const user = dto as User;
    return this.userService.create(user);
  }

  @Delete('/:id') // RESTfull Method
  removeUser(@Param('id') id: number): any {
    // 权限：判断用户是否有更新user的权限
    return this.userService.remove(id);
  }


}
