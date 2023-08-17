import { Controller, Get, Inject, Query, Res } from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IUsersService } from './users';
import { Response } from 'express';
@Controller(Routes.USERS)
export class UsersController {
  constructor(@Inject(Services.USERS) private userService: IUsersService) {}

  @Get('/search')
  async searchUsers(@Query('query') query: string, @Res() response: Response) {
    console.log(query);
    const users = await this.userService.searchUsers(query);
    return response.send(users);
  }
}
