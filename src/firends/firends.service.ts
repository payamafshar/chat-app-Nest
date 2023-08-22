import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repositories } from 'src/utils/constants';
import { FriendEntity } from 'src/utils/typeOrm/entities/firends.entity';
import { Repository } from 'typeorm';
import { IFirendService } from './firends';
import { DeleteFirendParams } from 'src/utils/types';

@Injectable()
export class FirendsService implements IFirendService {
  constructor(
    @Inject(Repositories.FIRENDS)
    private readonly firendsRepository: Repository<FriendEntity>,
  ) {}

  isFirends(userOneId: number, userTwoId: number) {
    return this.firendsRepository.findOne({
      where: [
        {
          sender: { id: userOneId },
          receiver: { id: userTwoId },
        },
        {
          sender: { id: userTwoId },
          receiver: { id: userOneId },
        },
      ],
    });
  }

  getFirends(userId: number): Promise<FriendEntity[]> {
    return this.firendsRepository.find({
      where: [{ sender: { id: userId }, receiver: { id: userId } }],
      relations: ['sender', 'receiver'],
    });
  }

  findFriendById(id: number): Promise<FriendEntity> {
    return this.firendsRepository.findOne({
      where: { id },
      relations: ['sender', 'receiver'],
    });
  }

  async deleteFirendById({ firendId, issuerId }: DeleteFirendParams) {
    const findedFirend = await this.firendsRepository.findOne({
      where: { id: firendId },
      relations: ['sender', 'receiver'],
    });

    if (!findedFirend) throw new NotFoundException('firend not found');

    // we want user just can delete firends belong to him
    if (
      findedFirend.receiver.id !== issuerId &&
      findedFirend.sender.id !== issuerId
    )
      throw new BadRequestException('cannot delete firend');
  }
}
