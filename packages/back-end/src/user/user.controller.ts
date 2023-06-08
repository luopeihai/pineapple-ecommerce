import {
  Controller,
  Get,
} from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service'

@Controller('user')
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


}
