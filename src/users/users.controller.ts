import { Controller, Inject } from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IUsersService } from './users';

@Controller(Routes.USERS)
export class UsersController {
  constructor(@Inject(Services.USERS) private userService: IUsersService) {}
}
