import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IConversationService } from './coversation';
import { AuthenticatedGuard } from 'src/auth/Strategy/guards';
import { AuthUser } from 'src/utils/decorators';
import { UserEntity } from 'src/utils/typeOrm/entities/user.entity';
import { CreateConversationDto } from './dtos/createConversationDto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller(Routes.CONVERSATION)
@UseGuards(AuthenticatedGuard)
export class ConversationController {
  constructor(
    @Inject(Services.CONVERSATION)
    private readonly conversationService: IConversationService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post('createConversation')
  async createConversation(
    @AuthUser() user: UserEntity,
    @Body() createConversatioPayload: CreateConversationDto,
  ) {
    const conversation = await this.conversationService.createConversation(
      user,
      createConversatioPayload,
    );

    this.eventEmitter.emit('conversation.created', conversation);
    return conversation;
  }

  @Get('conversations')
  getLoginUserConversations(@AuthUser() user: UserEntity) {
    const { id: userId } = user;
    return this.conversationService.getLoginUserConversations(userId);
  }

  @Get('/:id')
  getConversationById(@Param('id') id: number) {
    return this.conversationService.findConversationById(id);
  }
}
