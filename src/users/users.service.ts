import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { IUsersService } from './users';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/utils/typeOrm/entities/user.entity';
import { Repository } from 'typeorm';
import {
  CreateUserDetails,
  FindUserOptions,
  FindUserParams,
} from 'src/utils/types';
import { hashPassword } from 'src/utils/helper';
import { Repositories } from 'src/utils/constants';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @Inject(Repositories.USER)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async createUser(userDetails: CreateUserDetails) {
    const existingUser = await this.userRepository.findOne({
      where: {
        username: userDetails.username,
      },
    });
    if (existingUser)
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    const password = await hashPassword(userDetails.password);
    // const peer = this.peerRepository.create();
    const params = { ...userDetails, password };
    const newUser = this.userRepository.create(params);
    return this.userRepository.save(newUser);
  }
  findUser(
    findUserParams: FindUserParams,
    options?: FindUserOptions,
  ): Promise<UserEntity> {
    return this.userRepository.findOne({ where: findUserParams });
  }

  searchUsers(query: string) {
    const statement = '(user.username LIKE :query)';
    return this.userRepository
      .createQueryBuilder('user')
      .where(statement, { query: `%${query}%` })
      .limit(10)
      .select([
        'user.username',
        'user.firstName',
        'user.lastName',
        'user.email',
        'user.id',
      ])
      .getMany();
  }
}
