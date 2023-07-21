import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { IAuthService } from './auth';
import { Services } from 'src/utils/constants';
import { IUsersService } from 'src/users/users';
import { ValidateUserDetails } from 'src/utils/types';
import { compareHash } from 'src/utils/helper';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(Services.USERS) private readonly userService: IUsersService,
  ) {}
  async validateUser(userDetails: ValidateUserDetails) {
    const user = await this.userService.findUser(
      { username: userDetails.username },
      { selectAll: true },
    );
    console.log({ user });

    if (!user)
      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
    const isPasswordValid = await compareHash(
      userDetails.password,
      user.password,
    );
    return isPasswordValid ? user : null;
  }
}
