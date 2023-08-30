import { UserEntity } from 'src/utils/typeOrm/entities/user.entity';

export const userMock: UserEntity = {
  id: 21321,
  email: 'hellowWorld@gmail.com',

  username: 'testUsername',

  firstName: 'test user',

  password: 'testasdsad',

  lastName: 'test',

  messages: [],

  groups: [],
};
