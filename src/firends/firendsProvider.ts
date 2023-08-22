import { Repositories } from 'src/utils/constants';
import { FirendRequestEntity } from 'src/utils/typeOrm/entities/firendRequest.entity';
import { FriendEntity } from 'src/utils/typeOrm/entities/firends.entity';
import { DataSource } from 'typeorm';

export const firendsProvider = [
  {
    provide: Repositories.FIRENDS,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(FriendEntity),
    inject: ['DATA_SOURCE'],
  },
];
