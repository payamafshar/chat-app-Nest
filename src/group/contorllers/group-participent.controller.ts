import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IGroupParticipentService } from '../group';
import { AddRecipientDto } from '../dtos/addRecipient.dto';
import { AuthUser } from 'src/utils/decorators';
import { UserEntity } from 'src/utils/typeOrm/entities/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller(Routes.GROUP_PARTICIPENT)
export class GroupParticipentController {
  constructor(
    @Inject(Services.GROUP_PARTICIPENT)
    private readonly groupParticipentService: IGroupParticipentService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post('addRecipient')
  async addRecipientToGroup(
    @Body() addRecipientDto: AddRecipientDto,
    @Param('groupId', ParseIntPipe) groupId: number,
    @AuthUser() user: UserEntity,
  ) {
    const params = {
      username: addRecipientDto.username,
      groupId,
      userId: user.id,
    };
    const payload = await this.groupParticipentService.addRecipient(params);
    this.eventEmitter.emit('recipient.added', payload);
    return payload;
  }

  @Delete('deleteRecipient/:recipientId')
  async deleteRecipient(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('recipientId', ParseIntPipe) recipientId: number,
    @AuthUser() user: UserEntity,
  ) {
    const params = {
      removerId: user.id,
      recipientId,
      groupId,
    };

    const group = await this.groupParticipentService.delete(params);

    this.eventEmitter.emit('recipient.deleted', { group, recipientId });
    return {
      group,
      recipientId,
    };
  }
}
