import { Controller, Get, Inject, Query } from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IUsersService } from './users';

@Controller(Routes.USERS)
export class UsersController {
  constructor(@Inject(Services.USERS) private userService: IUsersService) {}

  @Get('/search')
  searchUsers(@Query('query') query: string) {
    console.log(query);
    return this.userService.searchUsers(query);
  }
}
