import {
  Controller,
  Get,
  Post,
  Body,
  UseFilters,
  Delete,
  Param
} from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service'
import { CreateUserDto } from "./dto/create-user.dto"
import { CreateUserPipe } from "./pipes/create-user.pipe"
import { Serialize } from '../common/decorators/serialize.decorator';
import { PublicUserDto } from './dto/public-user.dto';
import { TypeormFilter } from "../common/filters/typeorm.filter"

@Controller('user')
@UseFilters(new TypeormFilter())
@Serialize(PublicUserDto)
export class UserController {
  // private logger = new Logger(UserController.name);

  constructor(
    private userService: UserService
  ) {
    // this.logger.log('UserController init');
  }

  @Get('/:id')
  getUser(): any {
    return 'hello world';
    // return this.userService.getUsers();
  }


  @Post()
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
