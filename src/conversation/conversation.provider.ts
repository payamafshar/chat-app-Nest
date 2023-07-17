import { ConversationEntity } from 'src/utils/typeOrm/entities/conversations.entity';
import { DataSource } from 'typeorm';

export const conversationProvider = [
  {
    provide: 'CONVERSATION_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ConversationEntity),
    inject: ['DATA_SOURCE'],
  },
];
