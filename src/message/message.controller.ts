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

@Controller(Routes.MESSAGE)
export class MessageController {
  constructor(
    @Inject(Services.MESSAGE) private readonly messageService: IMessageService,
  ) {}

  @Post('createMessage')
  createMessage(
    @Body() createConversationPayload: CreateMessageDto,
    @AuthUser() user: UserEntity,
  ) {
    return this.messageService.createMessage({
      ...createConversationPayload,
      user,
    });
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
