import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IConversationService } from './coversation';
import { AuthenticatedGuard } from 'src/auth/Strategy/guards';
import { AuthUser } from 'src/utils/decorators';
import { UserEntity } from 'src/utils/typeOrm/entities/user.entity';
import { CreateConversationDto } from './dtos/createConversationDto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Response } from 'express';

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
    @Res() response: Response,
  ) {
    const conversation = await this.conversationService.createConversation(
      user,
      createConversatioPayload,
    );

    this.eventEmitter.emit('conversation.created', conversation);
    return response.send(conversation);
  }

  @Get('/conversations')
  async getLoginUserConversations(
    @AuthUser() user: UserEntity,
    @Res() response: Response,
  ) {
    const { id: userId } = user;
    const conversations =
      await this.conversationService.getLoginUserConversations(userId);
    return response.send(conversations);
  }

  @Get('find/:id')
  async getConversationById(
    @Param('id') id: number,
    @Res() response: Response,
  ) {
    const conversation = await this.conversationService.findConversationById(
      id,
    );
    return response.send(conversation);
  }
}
