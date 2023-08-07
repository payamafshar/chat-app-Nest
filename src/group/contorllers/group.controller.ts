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

@Controller(Routes.GROUP)
export class GroupController {
  constructor(
    @Inject(Services.GROUP) private readonly groupService: IGroupService,
  ) {}

  @Post('createGroup')
  createGroup(
    @Body() createGroupDto: CreateGroupDto,
    @AuthUser() user: UserEntity,
  ) {
    const params = {
      ...createGroupDto,
      creator: user,
    };
    return this.groupService.createGroup(params);
  }

  @Get('getGroups')
  getGroups(@AuthUser() user: UserEntity) {
    return this.groupService.getGroups({ userId: user.id });
  }

  @Get('/:groupId')
  getGroupById(@Param('groupId', ParseIntPipe) groupId: number) {
    return this.groupService.getGroupById(groupId);
  }
}
