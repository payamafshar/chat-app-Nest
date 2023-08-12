import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IGroupMessageService } from '../group';
import { CreateGroupMessageDto } from '../dtos/createGroupMessage.dto';
import { AuthUser } from 'src/utils/decorators';
import { UserEntity } from 'src/utils/typeOrm/entities/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller(Routes.GROUP_MESSAGE)
export class GroupMessageController {
  constructor(
    @Inject(Services.GROUP_MESSAGE)
    private readonly groupMessageService: IGroupMessageService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post('create')
  async createGroupMessage(
    @Body() createGroupMessageDto: CreateGroupMessageDto,
    @AuthUser() user: UserEntity,
    @Param('groupId', ParseIntPipe) groupId: number,
  ) {
    const params = {
      author: user,
      groupId,
      content: createGroupMessageDto.content,
    };
    const groupMessage = await this.groupMessageService.createGroupMessage(
      params,
    );

    this.eventEmitter.emit('groupMessage.created', groupMessage);
    return;
  }

  @Get('allGroupMessages')
  async getAllGroupMessages(@Param('groupId', ParseIntPipe) groupId: number) {
    const messages = await this.groupMessageService.getAllGroupMessages(
      groupId,
    );

    return {
      groupId,
      messages,
    };
  }

  @Delete('message/:messageId')
  async deleteMessageFromGroup(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('messageId', ParseIntPipe) messageId: number,
    @AuthUser() user: UserEntity,
  ) {
    const params = {
      messageId,
      groupId,
      userId: user.id,
    };

    await this.groupMessageService.deleteGroupMessage(params);

    this.eventEmitter.emit('groupMessage.delete', {
      userId: user.id,
      messageId,
      groupId,
    });

    return {
      groupId,
      messageId,
    };
  }
}
