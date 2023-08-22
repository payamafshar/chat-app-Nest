import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { IFriendRequestService } from './firend-request';
import {
  AcceptFirendRequestParams,
  CancelFirendRequestParams,
  CreateFirendRequestParams,
  RejectFirendRequestParams,
} from 'src/utils/types';
import { InjectRepository } from '@nestjs/typeorm';
import { FirendRequestEntity } from 'src/utils/typeOrm/entities/firendRequest.entity';
import { Repository } from 'typeorm';
import { Repositories, Services } from 'src/utils/constants';
import { IUsersService } from 'src/users/users';
import { IFirendService } from 'src/firends/firends';
import { FriendEntity } from 'src/utils/typeOrm/entities/firends.entity';
import { send } from 'process';

@Injectable()
export class FirendRequestService implements IFriendRequestService {
  constructor(
    @Inject(Repositories.FIREND_REQUEST)
    private readonly firendRequestRepository: Repository<FirendRequestEntity>,
    @Inject(Services.USERS) private readonly usersService: IUsersService,
    @Inject(Services.FIRENDS) private readonly firendsService: IFirendService,
    @Inject(Repositories.FIRENDS)
    private readonly firendsRepository: Repository<FriendEntity>,
  ) {}
  async create(params: CreateFirendRequestParams) {
    const { receiverUsername, sender } = params;

    const receiver = await this.usersService.findUser({
      username: receiverUsername,
    });

    if (!receiver) throw new NotFoundException('user not found');

    const sentedPendingRequest = await this.isPending(sender.id, receiver.id);

    if (sentedPendingRequest)
      throw new BadRequestException('request is pending');
    const exists = this.firendsService.isFirends(sender.id, receiver.id);

    if (receiver.id === sender.id)
      throw new BadRequestException('Cannot Add Yourself');
    if (exists) throw new BadRequestException('firend already exists');

    const friend = this.firendRequestRepository.create({
      sender,
      receiver,
      status: 'pending',
    });
    return this.firendRequestRepository.save(friend);
  }

  getPendingRequest(userId: number): Promise<FirendRequestEntity[]> {
    const status = 'pending';
    return this.firendRequestRepository.find({
      where: [
        { sender: { id: userId }, status },
        { receiver: { id: userId }, status },
      ],
      relations: ['receiver', 'sender'],
    });
  }
  async acceptFirendRequest(params: AcceptFirendRequestParams) {
    const { reqId, receiverId: userId } = params;
    const firendRequest = await this.findById(reqId);

    if (!firendRequest) throw new NotFoundException('request not found');
    if (firendRequest.status == 'accepted')
      throw new BadRequestException('firend request already accepted');
    // if(firendRequest.receiver.id == userId) throw new BadRequestException('can not send request ')
    firendRequest.status = 'accepted';
    const updatedRequest = await this.firendRequestRepository.save(
      firendRequest,
    );
    const newFriend = this.firendsRepository.create({
      sender: firendRequest.sender,
      receiver: firendRequest.receiver,
    });
    const friend = await this.firendsRepository.save(newFriend);
    return {
      friend,
      newFirendRequest: updatedRequest,
    };
  }

  async rejectFirendRequest({ receiverId, reqId }: RejectFirendRequestParams) {
    const firendRequest = await this.findById(reqId);
    if (!firendRequest) throw new NotFoundException('request not found');

    if (firendRequest.status == 'accepted')
      throw new BadRequestException('firend request already accepted');

    firendRequest.status = 'rejected';
    return this.firendRequestRepository.save(firendRequest);
  }

  async cancelFirendRequest({ receiverId, reqId }: CancelFirendRequestParams) {
    const firendRequest = await this.findById(reqId);
    if (!firendRequest) throw new NotFoundException('request not found');

    await this.firendRequestRepository.delete(reqId);
    return firendRequest;
  }

  isPending(
    userOneId: number,
    userTwoId: number,
  ): Promise<FirendRequestEntity> {
    return this.firendRequestRepository.findOne({
      where: [
        {
          sender: { id: userOneId },
          receiver: { id: userTwoId },
          status: 'pending',
        },
        {
          sender: { id: userTwoId },
          receiver: { id: userOneId },
          status: 'pending',
        },
      ],
    });
  }
  findById(id: number): Promise<FirendRequestEntity> {
    return this.firendRequestRepository.findOne({
      where: { id },
      relations: ['sender', 'receiver'],
    });
  }
}
