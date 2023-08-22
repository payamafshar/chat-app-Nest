import { Repositories } from 'src/utils/constants';
import { FirendRequestEntity } from 'src/utils/typeOrm/entities/firendRequest.entity';
import { DataSource } from 'typeorm';

export const firendRequestProvider = [
  {
    provide: Repositories.FIREND_REQUEST,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(FirendRequestEntity),
    inject: ['DATA_SOURCE'],
  },
];
