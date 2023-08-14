import { GroupEntity } from 'src/utils/typeOrm/entities/group.entity';
import { GroupMessageEntity } from 'src/utils/typeOrm/entities/groupMessage.entity';
import { UserEntity } from 'src/utils/typeOrm/entities/user.entity';
import {
  AddRecipientParam,
  CreateGroupMessageParams,
  CreateGroupParams,
  DeleteGroupMessageParams,
  EditGroupMessageParams,
  GetGroupsParam,
} from 'src/utils/types';

export interface IGroupService {
  createGroup(params: CreateGroupParams): Promise<GroupEntity>;

  getGroups(param: GetGroupsParam): Promise<GroupEntity[]>;

  findGroupById(groupId: number): Promise<GroupEntity>;

  saveGroup(group: GroupEntity): Promise<GroupEntity>;
}

export interface IGroupMessageService {
  createGroupMessage(params: CreateGroupMessageParams);

  getAllGroupMessages(groupId: number): Promise<GroupMessageEntity[]>;

  deleteGroupMessage(params: DeleteGroupMessageParams);

  editGroupMessage(params: EditGroupMessageParams): Promise<GroupMessageEntity>;
}

export interface IGroupParticipentService {
  addRecipient(param: AddRecipientParam): Promise<GroupEntity>;
}
