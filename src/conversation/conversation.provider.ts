import { Repositories } from 'src/utils/constants';
import { ConversationEntity } from 'src/utils/typeOrm/entities/conversations.entity';
import { DataSource } from 'typeorm';

export const conversationProvider = [
  {
    provide: Repositories.CONVERSATION,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ConversationEntity),
    inject: ['DATA_SOURCE'],
  },
];
