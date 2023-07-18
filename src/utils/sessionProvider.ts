import { DataSource } from 'typeorm';
import { SessionEntity } from './typeOrm/entities/session.entity';

export const sessionProvider = [
  {
    provide: 'SESSION_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(SessionEntity),
    inject: ['DATA_SOURCE'],
  },
];
