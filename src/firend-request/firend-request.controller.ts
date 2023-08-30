import {
  Controller,
  Inject,
  Post,
  Body,
  Param,
  Patch,
  ParseIntPipe,
  Delete,
  Get,
} from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IFriendRequestService } from './firend-request';
import { AuthUser } from 'src/utils/decorators';
import { UserEntity } from 'src/utils/typeOrm/entities/user.entity';
import { CreateFirendRequestDto } from './dtos/createFirendRequest.dto';

@Controller(Routes.FIREND_REQUEST)
export class FirendRequestController  {
  constructor(
    @Inject(Services.FIREND_REQUEST)
    private readonly firendRequestService: IFriendRequestService,
  ) {}

  @Post('create')
  createRequest(
    @Body() createFirendRequestDto: CreateFirendRequestDto,
    @AuthUser() user: UserEntity,
  ) {
    const params = {
      receiverUsername: createFirendRequestDto.receiver,
      sender: user,
    };
    return this.firendRequestService.create(params);
  }

  @Get('getAllRequests')
  getAllPendingRequests(@AuthUser() user: UserEntity) {
    return this.firendRequestService.getPendingRequest(user.id);
  }

  @Patch('/:reqId/accept')
  acceptFirendRequest(
    @Param('reqId', ParseIntPipe) reqId: number,
    @AuthUser() user: UserEntity,
  ) {
    const params = {
      reqId,
      receiverId: user.id,
    };
    return this.firendRequestService.acceptFirendRequest(params);
  }

  @Patch('/:reqId/reject')
  reject(
    @Param('reqId', ParseIntPipe) reqId: number,
    @AuthUser() user: UserEntity,
  ) {
    const params = {
      reqId,
      receiverId: user.id,
    };
    return this.firendRequestService.rejectFirendRequest(params);
  }

  @Delete('/:reqId/cancel')
  cancel(
    @Param('reqId', ParseIntPipe) reqId: number,
    @AuthUser() user: UserEntity,
  ) {
    const params = {
      reqId,
      receiverId: user.id,
    };

    return this.firendRequestService.cancelFirendRequest(params);
  }
}
