import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Repositories, Services } from 'src/utils/constants';
import { ConversationEntity } from 'src/utils/typeOrm/entities/conversations.entity';
import { Repository } from 'typeorm';
import { IConversationService } from './coversation';
import { UserEntity } from 'src/utils/typeOrm/entities/user.entity';
import { AccessParams, CreateConversationParams } from 'src/utils/types';
import { IUsersService } from 'src/users/users';
import { MessageEntity } from 'src/utils/typeOrm/entities/messages.entity';

@Injectable()
export class ConversationService implements IConversationService {
  constructor(
    @Inject(Repositories.CONVERSATION)
    private readonly conversationRepository: Repository<ConversationEntity>,
    @Inject(Services.USERS) private readonly usersService: IUsersService,
    @Inject(Repositories.MESSAGE)
    private readonly messagesRepository: Repository<MessageEntity>,
  ) {}

  async isCreated(userId: number, recipientId: number) {
    return this.conversationRepository.findOne({
      where: [
        {
          creator: { id: userId },
          recipient: { id: recipientId },
        },
        {
          creator: { id: recipientId },
          recipient: { id: userId },
        },
      ],
    });
  }

  async createConversation(
    creator: UserEntity,
    conversationParams: CreateConversationParams,
  ): Promise<ConversationEntity> {
    const { username, message: content } = conversationParams;

    const recipient = await this.usersService.findUser(
      { username },
      { selectAll: true },
    );

    if (!recipient) throw new BadRequestException();
    if (recipient.id == creator.id)
      throw new BadRequestException('cannot create conversation with yourSelf');
    const exists = await this.isCreated(creator.id, recipient.id);
    if (exists) throw new BadRequestException('Conversation Already Exist');
    const newConversation = this.conversationRepository.create({
      creator,
      recipient,
    });
    const conversation = await this.conversationRepository.save(
      newConversation,
    );

    if (content) {
      const newMessage = this.messagesRepository.create({
        content,
        author: creator,
        conversation,
      });

      const message = await this.messagesRepository.save(newMessage);

      await this.conversationRepository.update(
        { id: conversation.id },
        { lastMessageSent: message },
      );
      return conversation;
    }

    return conversation;
  }

  async getLoginUserConversations(userId: number) {
    return this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.lastMessageSent', 'lastMessageSent')
      .leftJoinAndSelect('conversation.creator', 'creator')
      .leftJoinAndSelect('conversation.recipient', 'recipient')
      .where('creator.id = :userId', { userId })
      .orWhere('recipient.id = :userId', { userId })
      .orderBy('conversation.lastMessageSent', 'DESC')
      .getMany();
  }

  async findConversationById(id: number): Promise<ConversationEntity> {
    return await this.conversationRepository.findOne({
      where: { id },
      relations: ['creator', 'messages', 'recipient', 'messages.author'],
    });
  }

  async hasAccess({ conversationId, userId }: AccessParams) {
    const conversation = await this.findConversationById(conversationId);
    if (!conversation) throw new BadRequestException('conversation not found');
    return (
      conversation.creator.id === userId || conversation.recipient.id === userId
    );
  }
}
