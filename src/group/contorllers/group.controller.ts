import {
  Controller,
  Post,
  Inject,
  Body,
  Get,
  ParseIntPipe,
  Param,
  Res,
  Patch,
} from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IGroupService } from '../group';
import { CreateGroupDto } from '../dtos/createGroup.dto';
import { AuthUser } from 'src/utils/decorators';
import { UserEntity } from 'src/utils/typeOrm/entities/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Response } from 'express';
import { TransferOwnerDto } from '../dtos/transferOwner.dto';

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
    @Res() response: Response,
  ) {
    const params = {
      ...createGroupDto,
      creator: user,
    };
    const group = await this.groupService.createGroup(params);
    this.eventEmitter.emit('group.created', group);
    return response.send(group);
  }

  @Get('/getGroups')
  async getGroups(@AuthUser() user: UserEntity, @Res() response: Response) {
    const groups = await this.groupService.getGroups({ userId: user.id });
    return response.send(groups);
  }

  @Get('find/:groupId')
  async getGroupById(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Res() response: Response,
  ) {
    const group = await this.groupService.findGroupById(groupId);
    return response.send(group);
  }
  @Patch('/owner/:groupId')
  async transferOwner(
    @Body() transferOwnerDto: TransferOwnerDto,
    @Param('groupId', ParseIntPipe) groupId: number,
    @AuthUser() user: UserEntity,
    @Res() response: Response,
  ) {
    const params = {
      username: transferOwnerDto.username,
      groupId,
      userId: user.id,
    };
    const payload = await this.groupService.transferOwner(params);

    this.eventEmitter.emit('transfer.owner.group', payload);
    return response.send(payload);
  }

  @Post('/:groupId/leave')
  async leaveUser(
    @Param('groupId', ParseIntPipe) groupId: number,
    @AuthUser() user: UserEntity,
    @Res() response: Response,
  ) {
    const params = {
      userId: user.id,
      groupId,
    };
    const newGroup = await this.groupService.leaveGroup(params);
    this.eventEmitter.emit('group.userLeave', {
      group: newGroup,
      issuerId: user.id,
    });

    return response.send({
      group: newGroup,
      issuerId: user.id,
    });
  }
}
