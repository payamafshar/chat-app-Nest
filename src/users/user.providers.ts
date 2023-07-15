import { SessionEntity } from 'src/utils/typeOrm/entities/session.entity';
import { UserEntity } from 'src/utils/typeOrm/entities/user.entity';
import { DataSource } from 'typeorm';

export const userProvider = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserEntity),
    inject: ['DATA_SOURCE'],
  },
];
export const sessionProvider = [
  {
    provide: 'SESSION_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(SessionEntity),
    inject: ['DATA_SOURCE'],
  },
];
