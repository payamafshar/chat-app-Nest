import { UserEntity } from 'src/utils/typeOrm/entities/user.entity';
import { ValidateUserDetails } from 'src/utils/types';

export interface IAuthService {
  validateUser(
    userCredentials: ValidateUserDetails,
  ): Promise<UserEntity | null>;
}
