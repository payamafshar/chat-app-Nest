import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { Services } from 'src/utils/constants';
import { IUsersService } from 'src/users/users';
import * as classTransformer from 'class-transformer';
const createUserDto = {
  firstName: 'payam',
  lastName: 'afshari',
  username: 'payam1',
  password: 'asdsd',
};

describe('AuthController', () => {
  let controller: AuthController;
  let usersService: IUsersService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: Services.USERS,
          useValue: {
            createUser: jest.fn().mockReturnValue([]),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    usersService = module.get<IUsersService>(Services.USERS);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(usersService).toBeDefined();
  });

  describe('registerUser ', () => {
    it('should call with usersService.createUser', async () => {
      const mockCreateUser = jest.fn().mockReturnValue([]);
      jest.spyOn(usersService, 'createUser').mockImplementation(mockCreateUser);
      const plainToClassSpy = jest
        .spyOn(classTransformer, 'instanceToPlain')
        .mockReturnValue([]);
      await controller.registerUser(createUserDto);
      expect(mockCreateUser).toHaveBeenCalledWith(createUserDto);
      expect(plainToClassSpy).toHaveBeenCalledWith(
        usersService.createUser(createUserDto),
      );
    });
  });
});
