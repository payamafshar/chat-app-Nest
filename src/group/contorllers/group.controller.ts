import {
  Controller,
  Post,
  Inject,
  Body,
  Get,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IGroupService } from '../group';
import { CreateGroupDto } from '../dtos/createGroup.dto';
import { AuthUser } from 'src/utils/decorators';
import { UserEntity } from 'src/utils/typeOrm/entities/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller(Routes.GROUP)
export class GroupController {
  constructor(
    @Inject(Services.GROUP) private readonly groupService: IGroupService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post('createGroup')
  async createGroup(
    @Body() createGroupDto: CreateGroupDto,
    @AuthUser() user: UserEntity,
  ) {
    const params = {
      ...createGroupDto,
      creator: user,
    };
    const group = await this.groupService.createGroup(params);
    this.eventEmitter.emit('group.created', group);
    return group;
  }

  @Get('getGroups')
  getGroups(@AuthUser() user: UserEntity) {
    return this.groupService.getGroups({ userId: user.id });
  }

  @Get('/:groupId')
  getGroupById(@Param('groupId', ParseIntPipe) groupId: number) {
    return this.groupService.findGroupById(groupId);
  }
}
