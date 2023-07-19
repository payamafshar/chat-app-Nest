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
    console.log(user);

    return this.conversationService.createConversation(
      user,
      createConversatioPayload,
    );
  }

  @Get('/:id')
  getConversationById(@Param('id') id: number) {
    return this.conversationService.findConversationById(id);
  }
}
