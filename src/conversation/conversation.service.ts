import { Inject, Injectable } from '@nestjs/common';
import { Repositories } from 'src/utils/constants';
import { ConversationEntity } from 'src/utils/typeOrm/entities/conversations.entity';
import { Repository } from 'typeorm';
import { IConversationService } from './coversation';
import { UserEntity } from 'src/utils/typeOrm/entities/user.entity';
import { CreateConversationParams } from 'src/utils/types';

@Injectable()
export class ConversationService implements IConversationService {
  constructor(
    @Inject(Repositories.CONVERSATION)
    private readonly conversationRepository: Repository<ConversationEntity>,
  ) {}

  async createConversation(
    user: UserEntity,
    conversationParams: CreateConversationParams,
  ): Promise<ConversationEntity> {
    return;
  }
}
