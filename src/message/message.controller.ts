import {
  Controller,
  Inject,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import IMessageService from './message';
import { CreateConversationDto } from 'src/conversation/dtos/createConversationDto';
import { AuthUser } from 'src/utils/decorators';
import { UserEntity } from 'src/utils/typeOrm/entities/user.entity';
import { CreateMessageDto } from './dtos/createMessageDto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller(Routes.MESSAGE)
export class MessageController {
  constructor(
    @Inject(Services.MESSAGE) private readonly messageService: IMessageService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post('createMessage')
  async createMessage(
    @Body() createConversationPayload: CreateMessageDto,
    @AuthUser() user: UserEntity,
  ) {
    const msg = await this.messageService.createMessage({
      ...createConversationPayload,
      user,
    });
    this.eventEmitter.emit('create.message', msg);
    return;
  }

  @Get(':conversationId')
  async getMessagesFromConversation(
    @Param('conversationId', ParseIntPipe)
    conversationId: number,
    @AuthUser() user: UserEntity,
  ) {
    const messages = await this.messageService.getMessagesByConversationId(
      conversationId,
      user,
    );

    return {
      conversationId,
      messages,
    };
  }

  @Delete(':messageId/conversation/:conversationId')
  async deleteMessageInConversation(
    @Param('messageId', ParseIntPipe) messageId: number,
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @AuthUser() user: UserEntity,
  ) {
    const params = { userId: user.id, messageId, conversationId };
    await this.messageService.deleteMessageWithParams(params);

    this.eventEmitter.emit('message.delete', {
      userId: user.id,
      conversationId,
      messageId,
    });

    return {
      messageId,
      conversationId,
    };
  }
}
