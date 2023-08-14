import {
  Body,
  Controller,
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

@Controller(Routes.GROUP_PARTICIPENT)
export class GroupParticipentController {
  constructor(
    @Inject(Services.GROUP_PARTICIPENT)
    private readonly groupParticipentService: IGroupParticipentService,
  ) {}

  @Post('addRecipient')
  addRecipientToGroup(
    @Body() addRecipientDto: AddRecipientDto,
    @Param('groupId', ParseIntPipe) groupId: number,
    @AuthUser() user: UserEntity,
  ) {
    const params = {
      username: addRecipientDto.username,
      groupId,
      userId: user.id,
    };
    return this.groupParticipentService.addRecipient(params);
  }
}