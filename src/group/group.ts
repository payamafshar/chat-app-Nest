import { GroupEntity } from 'src/utils/typeOrm/entities/group.entity';
import { GroupMessageEntity } from 'src/utils/typeOrm/entities/groupMessage.entity';
import { UserEntity } from 'src/utils/typeOrm/entities/user.entity';
import {
  AccessGroupParams,
  AddRecipientParam,
  CreateGroupMessageParams,
  CreateGroupParams,
  DeleteGroupMessageParams,
  DeleteRecipientParam,
  EditGroupMessageParams,
  GetGroupsParam,
  TransferOwnerParams,
} from 'src/utils/types';

export interface IGroupService {
  createGroup(params: CreateGroupParams): Promise<GroupEntity>;

  getGroups(param: GetGroupsParam): Promise<GroupEntity[]>;

  findGroupById(groupId: number): Promise<GroupEntity>;

  saveGroup(group: GroupEntity): Promise<GroupEntity>;
  hasAccess(params: AccessGroupParams): Promise<UserEntity | undefined>;
  transferOwner(params: TransferOwnerParams);
}

export interface IGroupMessageService {
  createGroupMessage(params: CreateGroupMessageParams);

  getAllGroupMessages(groupId: number): Promise<GroupMessageEntity[]>;

  deleteGroupMessage(params: DeleteGroupMessageParams);

  editGroupMessage(params: EditGroupMessageParams): Promise<GroupMessageEntity>;
}

export interface IGroupParticipentService {
  addRecipient(param: AddRecipientParam);
  delete(params: DeleteRecipientParam);
}
