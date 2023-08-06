import { GroupEntity } from 'src/utils/typeOrm/entities/group.entity';
import { CreateGroupParams, GetGroupsParam } from 'src/utils/types';

export interface IGroupService {
  createGroup(params: CreateGroupParams): Promise<GroupEntity>;

  getGroups(param: GetGroupsParam): Promise<GroupEntity[]>;
}
