import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repositories } from 'src/utils/constants';
import { MessageEntity } from 'src/utils/typeOrm/entities/messages.entity';
import { Repository } from 'typeorm';
import IMessageService from './message';
import { ConversationEntity } from 'src/utils/typeOrm/entities/conversations.entity';
import { CreateConversationParams, CreateMessageParams } from 'src/utils/types';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class MessageService implements IMessageService {
  constructor(
    @Inject(Repositories.MESSAGE)
    private messageRepository: Repository<MessageEntity>,
    @Inject(Repositories.CONVERSATION)
    private conversationRepository: Repository<ConversationEntity>,
  ) {}

  async createMessage({ user, conversationId, content }: CreateMessageParams) {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: ['creator', 'recipient'],
    });

    if (!conversation) throw new NotFoundException('conversation not found');

    const { creator, recipient } = conversation;

    if (user.id !== creator.id && user.id !== recipient.id) {
      throw new BadRequestException('cannot create message');
    }

    const newMessage = this.messageRepository.create({
      conversation,
      content,
      author: instanceToPlain(user),
    });

    const savedMessage = await this.messageRepository.save(newMessage);

    conversation.lastMessageSent = savedMessage;

    await this.conversationRepository.save(conversation);
    return;
  }

  async getMessagesByConversationId(
    conversationId: number,
  ): Promise<MessageEntity[]> {
    console.log({ conversationId });
    return this.messageRepository.find({
      where: { conversation: { id: conversationId } },
      order: { createdAt: 'DESC' },
      relations: ['author'],
    });
  }
}
