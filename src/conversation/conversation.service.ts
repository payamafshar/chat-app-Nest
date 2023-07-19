import { Inject, Injectable } from '@nestjs/common';
import { Repositories, Services } from 'src/utils/constants';
import { ConversationEntity } from 'src/utils/typeOrm/entities/conversations.entity';
import { Repository } from 'typeorm';
import { IConversationService } from './coversation';
import { UserEntity } from 'src/utils/typeOrm/entities/user.entity';
import { CreateConversationParams } from 'src/utils/types';
import { IUsersService } from 'src/users/users';

@Injectable()
export class ConversationService implements IConversationService {
  constructor(
    @Inject(Repositories.CONVERSATION)
    private readonly conversationRepository: Repository<ConversationEntity>,
    @Inject(Services.USERS) private readonly usersService: IUsersService,
  ) {}

  async createConversation(
    creator: UserEntity,
    conversationParams: CreateConversationParams,
  ): Promise<ConversationEntity> {
    const { username, message: content } = conversationParams;

    const recipient = await this.usersService.findUser(
      { username },
      { selectAll: true },
    );

    const newConversation = this.conversationRepository.create();
    newConversation.creator = creator;
    newConversation.recipient = recipient;
    const conversation = await this.conversationRepository.save(
      newConversation,
    );

    return conversation;
  }

  async findConversationById(id: number): Promise<ConversationEntity> {
    return await this.conversationRepository.findOne({
      where: { id },
      relations: ['creator', 'messages', 'recipient', 'messages.author'],
    });
  }
}
