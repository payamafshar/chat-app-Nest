import { MessageEntity } from 'src/utils/typeOrm/entities/messages.entity';
import { DataSource } from 'typeorm';

export const messageProvider = [
  {
    provide: 'MESSAGE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(MessageEntity),
    inject: ['DATA_SOURCE'],
  },
];
