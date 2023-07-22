import {
  Controller,
  Inject,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
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
  getMessagesFromConversation(
    @Param('conversationId', ParseIntPipe)
    conversationId: number,
    @AuthUser() user: UserEntity,
  ) {
    return this.messageService.getMessagesByConversationId(conversationId);
  }
}
