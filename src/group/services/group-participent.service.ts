import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IGroupParticipentService } from '../group';
import { GroupEntity } from 'src/utils/typeOrm/entities/group.entity';
import { AddRecipientParam, DeleteRecipientParam } from 'src/utils/types';
import { Repositories, Services } from 'src/utils/constants';
import { IUsersService } from 'src/users/users';
import { Repository } from 'typeorm';

@Injectable()
export class GroupParticipentService implements IGroupParticipentService {
  constructor(
    @Inject(Services.USERS) private readonly userService: IUsersService,
    @Inject(Repositories.GROUP)
    private readonly groupRepository: Repository<GroupEntity>,
  ) {}

  async addRecipient(params: AddRecipientParam) {
    const { groupId, userId, username } = params;

    const recipient = await this.userService.findUser({ username });
    if (!recipient) throw new BadRequestException('cannot Add User');
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: ['users', 'creator'],
    });
    if (!group) throw new NotFoundException('group not found');

    if (group.creator.id !== userId)
      throw new BadRequestException('you dont have premission to add user');

    const exists = group.users.find((u) => u.id == recipient.id);
    if (exists) throw new BadRequestException('user already exists in group');

    group.users = [...group.users, recipient];

    const savedGroup = await this.groupRepository.save(group);

    return {
      group: savedGroup,
      recipientId: recipient.id,
    };
  }
  async delete(params: DeleteRecipientParam) {
    const { removerId, groupId, recipientId } = params;

    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: ['users', 'creator'],
    });
    console.log(group);
    console.log(recipientId);
    if (!group) throw new NotFoundException('group Not found');

    if (removerId !== group.creator.id)
      throw new BadRequestException('dont have premisson to delete user');
    if (recipientId == group.creator.id)
      throw new BadRequestException('owner can not leave group');

    const newUsers = group.users.filter((u) => u.id !== recipientId);

    group.users = newUsers;

    await this.groupRepository.save(group);

    return group;
  }
}
