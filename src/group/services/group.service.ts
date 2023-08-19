import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { IGroupService } from '../group';
import { GroupEntity } from 'src/utils/typeOrm/entities/group.entity';
import {
  AccessGroupParams,
  CreateGroupParams,
  GetGroupsParam,
  LeaveUserFromGroup,
  TransferOwnerParams,
} from 'src/utils/types';
import { Repositories, Services } from 'src/utils/constants';
import { IUsersService } from 'src/users/users';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/utils/typeOrm/entities/user.entity';

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
    console.log({ creator });
    const users = (await Promise.all(usersPromise)).filter((user) => user);
    console.log(users);
    const findCreatorInDto = users.find((user) => user.id == creator.id);
    if (!findCreatorInDto) users.unshift(creator);

    const groupInstance = this.groupRepository.create({
      users,
      title: title,
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
      .leftJoinAndSelect('group.lastMessageSent', 'lastMessageSent')
      .leftJoinAndSelect('group.creator', 'creator')
      .leftJoinAndSelect('group.owner', 'owner')
      .orderBy('group.lastMessageSentAt', 'DESC')
      .getMany();
  }

  findGroupById(groupId: number): Promise<GroupEntity> {
    return this.groupRepository.findOne({
      where: { id: groupId },
      relations: ['messages', 'creator', 'users', 'lastMessageSent', 'owner'],
    });
  }

  async hasAccess({
    groupId,
    userId,
  }: AccessGroupParams): Promise<UserEntity | undefined> {
    const group = await this.findGroupById(groupId);
    if (!group) throw new NotFoundException();
    return group.users.find((user) => user.id === userId);
  }
  async transferOwner({ userId, username, groupId }: TransferOwnerParams) {
    const group = await this.findGroupById(groupId);
    if (!group) throw new NotFoundException('group Not Found');

    const newOwner = await this.usersService.findUser({ username });
    if (!newOwner) throw new BadRequestException('cannot transfer admin');
    if (userId == newOwner.id)
      throw new BadRequestException('you are already owner');
    if (userId !== group.creator.id)
      throw new BadRequestException('insuficent premission');

    group.owner = newOwner;
    const groupWithNewOwner = await this.groupRepository.save(group);

    return {
      groupWithNewOwner,
      newOwnerId: newOwner.id,
    };
  }

  async leaveGroup({ userId, groupId }: LeaveUserFromGroup) {
    const group = await this.findGroupById(groupId);
    if (!group) throw new BadRequestException();
    if (group.creator.id == userId && !group.owner && group.users.length >= 2) {
      const newCreator = group.users[group.users.length - 1];
      const newGroup = group.users.filter((u) => u.id !== userId);
      console.log('1111111111111111111111111111111');
      group.users = newGroup;
      group.creator = newCreator;
      return this.groupRepository.save(group);
    } else if (group.creator.id == userId && group.owner) {
      const newGroup = group.users.filter((u) => u.id !== userId);
      group.users = newGroup;
      group.creator = group.owner;
      return this.groupRepository.save(group);
    } else if (group.owner?.id == userId) {
      group.owner = null;
      const newGroup = group.users.filter((u) => u.id !== userId);
      group.users = newGroup;
      return this.groupRepository.save(group);
    } else {
      const newGroup = group.users.filter((u) => u.id !== userId);
      group.users = newGroup;
      return this.groupRepository.save(group);
    }
  }
}
