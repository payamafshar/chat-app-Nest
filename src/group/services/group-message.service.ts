import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IGroupMessageService, IGroupService } from '../group';
import { GroupMessageEntity } from 'src/utils/typeOrm/entities/groupMessage.entity';
import { CreateGroupMessageParams } from 'src/utils/types';
import { Repositories, Services } from 'src/utils/constants';
import { Repository } from 'typeorm';
import { GroupEntity } from 'src/utils/typeOrm/entities/group.entity';

@Injectable()
export class GroupMessageService implements IGroupMessageService {
  constructor(
    @Inject(Repositories.GROUP_MESSAGE)
    private readonly groupMessageRepository: Repository<GroupMessageEntity>,
    @Inject(Repositories.GROUP)
    private readonly groupRepository: Repository<GroupEntity>,
  ) {}

  async createGroupMessage(params: CreateGroupMessageParams) {
    const { groupId, content, author } = params;

    const findedGroup = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: ['users', 'lastMessageSent'],
    });

    if (!findedGroup) throw new NotFoundException('group not found');

    const existUser = findedGroup.users.find((user) => user.id == author.id);

    if (!existUser)
      throw new BadRequestException('you are not exist in this group');

    const groupMessageInstance = this.groupMessageRepository.create({
      content,
      author,
      group: findedGroup,
    });

    const savedGroupMessage = await this.groupMessageRepository.save(
      groupMessageInstance,
    );

    findedGroup.lastMessageSent = savedGroupMessage;

    const updatedGroup = await this.groupRepository.save(findedGroup);
    return {
      message: savedGroupMessage,
      group: updatedGroup,
    };
  }

  async getAllGroupMessages(groupId: number): Promise<GroupMessageEntity[]> {
    return await this.groupMessageRepository.find({
      where: { group: { id: groupId } },
      relations: ['author'],
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
