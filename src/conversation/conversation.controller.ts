import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IConversationService } from './coversation';
import { AuthenticatedGuard } from 'src/auth/Strategy/guards';
import { AuthUser } from 'src/utils/decorators';
import { UserEntity } from 'src/utils/typeOrm/entities/user.entity';
import { CreateConversationDto } from './dtos/createConversationDto';

@Controller(Routes.CONVERSATION)
@UseGuards(AuthenticatedGuard)
export class ConversationController {
  constructor(
    @Inject(Services.CONVERSATION)
    private readonly conversationService: IConversationService,
  ) {}

  @Post('createConversation')
  createConversation(
    @AuthUser() user: UserEntity,
    @Body() createConversatioPayload: CreateConversationDto,
  ) {
    return this.conversationService.createConversation(
      user,
      createConversatioPayload,
    );
  }

  @Get('conversations')
  getConversations(@AuthUser() user: UserEntity) {
    const { id: userId } = user;
    return this.conversationService.getConversations(userId);
  }

  @Get('/:id')
  getConversationById(@Param('id') id: number) {
    return this.conversationService.findConversationById(id);
  }
}
