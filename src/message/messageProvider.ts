import { Repositories } from 'src/utils/constants';
import { MessageEntity } from 'src/utils/typeOrm/entities/messages.entity';
import { DataSource } from 'typeorm';

export const messageProvider = [
  {
    provide: Repositories.MESSAGE,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(MessageEntity),
    inject: ['DATA_SOURCE'],
  },
];
