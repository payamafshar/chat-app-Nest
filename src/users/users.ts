import { UserEntity } from 'src/utils/typeOrm/entities/user.entity';
import {
  CreateUserDetails,
  FindUserOptions,
  FindUserParams,
} from 'src/utils/types';

export interface IUsersService {
  createUser(createUserDetails: CreateUserDetails);

  findUser(
    findUserParams: FindUserParams,
    options?: FindUserOptions,
  ): Promise<UserEntity>;
}
