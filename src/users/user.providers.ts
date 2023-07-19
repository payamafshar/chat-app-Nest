import { Repositories } from 'src/utils/constants';
import { SessionEntity } from 'src/utils/typeOrm/entities/session.entity';
import { UserEntity } from 'src/utils/typeOrm/entities/user.entity';
import { DataSource } from 'typeorm';

export const userProvider = [
  {
    provide: Repositories.USER,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserEntity),
    inject: ['DATA_SOURCE'],
  },
];
