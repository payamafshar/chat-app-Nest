import { Injectable } from '@nestjs/common';
import { IUsersService } from './users';

@Injectable()
export class UsersService implements IUsersService {
  createUser() {
    console.log('userService.createe');
  }
}
