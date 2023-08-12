import { Injectable, Inject } from '@nestjs/common';
import { IGroupService } from '../group';
import { GroupEntity } from 'src/utils/typeOrm/entities/group.entity';
import { CreateGroupParams, GetGroupsParam } from 'src/utils/types';
import { Repositories, Services } from 'src/utils/constants';
import { IUsersService } from 'src/users/users';
import { Repository } from 'typeorm';

@Injectable()
export class GroupService implements IGroupService {
  constructor(
    @Inject(Services.USERS) private readonly usersService: IUsersService,
    @Inject(Repositories.GROUP)
    private readonly groupRepository: Repository<GroupEntity>,
  ) {}
  async createGroup(params: CreateGroupParams): Promise<GroupEntity> {
    const { creator, title } = params;
    const usersPromise = params.users.map(async (username) => {
      const findedUserByUserName = await this.usersService.findUser({
        username,
      });
      return findedUserByUserName;
    });
    const users = (await Promise.all(usersPromise)).filter((user) => user);
    const findCreatorInDto = users.find((user) => user.id == creator.id);
    if (!findCreatorInDto) users.unshift(creator);

    const groupInstance = this.groupRepository.create({
      users,
      title: title,
      owner: creator,
      creator,
    });

    return this.groupRepository.save(groupInstance);
  }

  getGroups(param: GetGroupsParam): Promise<GroupEntity[]> {
    return this.groupRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.users', 'user')
      .where('user.id IN (:users)', { users: [param.userId] })
      .leftJoinAndSelect('group.users', 'users')
      .orderBy('group.lastMessageSentAt', 'DESC')
      .getMany();
  }

  findGroupById(groupId: number): Promise<GroupEntity> {
    return this.groupRepository.findOne({
      where: { id: groupId },
      relations: ['messages', 'creator', 'users', 'lastMessageSent'],
    });
  }

  saveGroup(group: GroupEntity): Promise<GroupEntity> {
    return this.groupRepository.save(group);
  }
}
