import { GroupEntity } from 'src/utils/typeOrm/entities/group.entity';
import { UserEntity } from 'src/utils/typeOrm/entities/user.entity';
import { CreateGroupParams, GetGroupsParam } from 'src/utils/types';

export interface IGroupService {
  createGroup(params: CreateGroupParams): Promise<GroupEntity>;

  getGroups(param: GetGroupsParam): Promise<GroupEntity[]>;

  getGroupById(groupId: number): Promise<GroupEntity>;
}
