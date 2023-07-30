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
import { CreateMessageParams, DeleteMessageParams } from 'src/utils/types';
import { instanceToPlain } from 'class-transformer';
import { UserEntity } from 'src/utils/typeOrm/entities/user.entity';

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
    const updated = await this.conversationRepository.save(conversation);

    return {
      message: savedMessage,
      conversation: updated,
    };
  }

  async getMessagesByConversationId(
    conversationId: number,
    user: UserEntity,
  ): Promise<MessageEntity[]> {
    console.log({ conversationId });
    return this.messageRepository.find({
      where: { conversation: { id: conversationId } },
      order: { createdAt: 'DESC' },
      relations: ['author'],
    });

    //there is option in typeOrm is loadRelationIds : boolean if neccessery
  }
  async deleteMessageWithParams(params: DeleteMessageParams) {
    const { userId, conversationId, messageId } = params;

    const conversation = await this.conversationRepository
      .createQueryBuilder('conversations')
      .where('conversations.id = :id', { id: conversationId })
      .leftJoinAndSelect('conversations.lastMessageSent', 'lastMessageSent')
      .leftJoinAndSelect('conversations.messages', 'messages')
      .orderBy('messages.createdAt', 'DESC')
      .limit(5)
      .getOne();

    if (!conversation) throw new BadRequestException('conversation not found');

    const message = await this.messageRepository.findOne({
      where: {
        id: messageId,
        author: { id: userId },
        conversation: { id: conversationId },
      },
      relations: ['author'],
    });

    console.log(message);

    if (!message) throw new BadRequestException('Cannot delete Message');

    if (conversation.lastMessageSent.id !== message.id) {
      return this.messageRepository.delete(message.id);
    }

    return this.deleteLastMessage(conversation, message);
  }

  async deleteLastMessage(
    conversation: ConversationEntity,
    message: MessageEntity,
  ) {
    const size = conversation.messages.length;
    const SECOND_MESSAGE_INDEX = 1;
    if (size <= 1) {
      console.log('Last Message Sent is deleted');
      await this.conversationRepository.update(
        {
          id: conversation.id,
        },
        { lastMessageSent: null },
      );
      const deletedMessage = await this.messageRepository.delete({
        id: message.id,
      });
      console.log(deletedMessage.affected);
      //deleteing conversation when exist one message and user deleting that message conversation removed also double check
      return this.conversationRepository.delete({ id: conversation.id });
    } else {
      console.log('There are more than 1 message');
      const newLastMessage = conversation.messages[SECOND_MESSAGE_INDEX];
      await this.conversationRepository.update(
        {
          id: conversation.id,
        },
        {
          lastMessageSent: newLastMessage,
        },
      );
      return this.messageRepository.delete({ id: message.id });
    }
  }
}
