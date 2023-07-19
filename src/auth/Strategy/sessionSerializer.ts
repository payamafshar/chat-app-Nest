import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { Services } from '../../utils/constants';
import { IUsersService } from 'src/users/users';
import { UserEntity } from 'src/utils/typeOrm/entities/user.entity';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject(Services.USERS)
    private readonly userService: IUsersService,
  ) {
    super();
  }
  serializeUser(user: UserEntity, done: Function) {
    done(null, user);
  }
  async deserializeUser(user: UserEntity, done: Function) {
    const userDb = await this.userService.findUser({ id: user.id });
    return userDb ? done(null, userDb) : done(null, null);
  }
}
