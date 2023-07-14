import { Inject, Injectable } from '@nestjs/common';
import { IAuthService } from './auth';
import { Services } from 'src/utils/constants';
import { IUsersService } from 'src/users/users';

@Injectable()
export class AuthService implements IAuthService {
  constructor() {}
  validateUser() {}

  registerUser() {
    return 'hello';
  }
}
