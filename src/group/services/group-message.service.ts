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

@Injectable()
export class GroupMessageService implements IGroupMessageService {
  constructor(
    @Inject(Repositories.GROUP_MESSAGE)
    private readonly groupMessageRepository: Repository<GroupMessageEntity>,
    @Inject(Services.GROUP) private readonly groupService: IGroupService,
  ) {}

  async createGroupMessage(params: CreateGroupMessageParams) {
    const { groupId, content, author } = params;
    const findedGroup = await this.groupService.findGroupById(groupId);

    if (!findedGroup) throw new NotFoundException('group not found');

    const existUser = findedGroup.users.find((user) => user.id == author.id);

    if (!existUser)
      throw new BadRequestException('you are not exist in this group');

    const groupMessageInstance = this.groupMessageRepository.create({
      content,
      group: findedGroup,
      author,
    });

    const savedGroupMessage = await this.groupMessageRepository.save(
      groupMessageInstance,
    );

    findedGroup.lastMessageSent = savedGroupMessage;
    const updatedGroup = await this.groupService.saveGroup(findedGroup);

    // returnin this groupMessage with group beacuse we want know to send event for wich group id with event emmitter
    return {
      message: savedGroupMessage,
      group: updatedGroup,
    };
  }
}
