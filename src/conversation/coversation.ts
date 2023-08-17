import { ConversationEntity } from 'src/utils/typeOrm/entities/conversations.entity';
import { UserEntity } from 'src/utils/typeOrm/entities/user.entity';
import { AccessParams, CreateConversationParams } from 'src/utils/types';

export interface IConversationService {
  createConversation(
    user: UserEntity,
    conversationParams: CreateConversationParams,
  ): Promise<ConversationEntity>;

  findConversationById(id: number): Promise<ConversationEntity>;
  getLoginUserConversations(id: number): Promise<ConversationEntity[]>;
  hasAccess(params: AccessParams);
}
