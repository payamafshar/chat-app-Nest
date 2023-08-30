import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { Services } from 'src/utils/constants';
import { IUsersService } from 'src/users/users';
import { IAuthService } from '../auth';
import { UserEntity } from 'src/utils/typeOrm/entities/user.entity';
import { userMock } from 'src/_mocks/users.mock';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: IAuthService;
  let usersService: IUsersService;
  let fakeUserService: Partial<IUsersService>;
  beforeEach(async () => {
    const fakeUserService: Partial<IUsersService> = {
      findUser: jest
        .fn()
        .mockImplementation((username: 'testUsername') => userMock),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: Services.AUTH,
          useClass: AuthService,
        },
        {
          provide: Services.USERS,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    authService = module.get<IAuthService>(Services.AUTH);
    usersService = module.get<IUsersService>(Services.USERS);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('AuthService.validateUser', () => {
    it('should call usersService.findUserById and user been defined', async () => {
      const user = await usersService.findUser({ username: 'asdasd' });
      expect(user).toBeDefined();
    });
    it('should throw error when user not found', async () => {
      jest
        .spyOn(usersService, 'findUser')
        .mockImplementationOnce(() =>
          Promise.resolve({ id: 30, username: 'asdasd' } as UserEntity),
        );
      expect(
        authService.validateUser({
          username: userMock.username,
          password: userMock.password,
        }),
      ).rejects.toThrowError();
    });
    it.only('compare password with hash and if valid password return user else return null', async () => {
      const compareMock = jest.spyOn(bcrypt, 'compare');
      compareMock.mockImplementationOnce(() => Promise.resolve(true));
      await authService.validateUser({
        username: userMock.username,
        password: userMock.password,
      });
      const user = await usersService.findUser({ username: userMock.username });
      expect(compareMock).toHaveBeenCalledWith(
        userMock.password,
        user.password,
      );
      expect(user.password).toEqual(userMock.password);
    });
  });
});
