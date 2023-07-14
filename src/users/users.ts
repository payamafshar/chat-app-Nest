import { CreateUserDetails } from 'src/utils/types';

export interface IUsersService {
  createUser(createUserDetails: CreateUserDetails);
}
