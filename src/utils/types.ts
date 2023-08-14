import { Request } from 'express';
import { UserEntity } from './typeOrm/entities/user.entity';
import { ConversationEntity } from './typeOrm/entities/conversations.entity';
import { MessageEntity } from './typeOrm/entities/messages.entity';
import { GroupEntity } from './typeOrm/entities/group.entity';
import { GroupMessageEntity } from './typeOrm/entities/groupMessage.entity';

export type CreateUserDetails = {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type ValidateUserDetails = {
  username: string;
  password: string;
};

export type FindUserParams = Partial<{
  id: number;
  email: string;
  username: string;
}>;

export type FindUserOptions = Partial<{
  selectAll: boolean;
}>;

export interface AuthenticatedRequest extends Request {
  user: UserEntity;
}

export type CreateConversationParams = {
  username: string;
  message: string;
};

export type CreateMessageParams = {
  content: string;
  conversationId: number;
  user: UserEntity;
};

export type CreateMessageResponse = {
  conversation: ConversationEntity;
  message: MessageEntity;
};

export type DeleteMessageParams = {
  userId: number;
  conversationId: number;
  messageId: number;
};

export type EditMessageParams = {
  userId: number;
  conversationId: number;
  messageId: number;
  content: string;
};

export type DeleteMessagePayload = {
  conversationId: number;
  userId: number;
  messageId: number;
};

export type CreateGroupParams = {
  users: string[];
  title?: string;
  creator: UserEntity;
};

export type GetGroupsParam = {
  userId: number;
};

export type CreateGroupMessageParams = {
  groupId: number;
  content: string;
  author: UserEntity;
};

export type GroupMessageEventPayload = {
  group: GroupEntity;
  message: GroupMessageEntity;
};

export type DeleteGroupMessageParams = {
  groupId: number;
  messageId: number;
  userId: number;
};

export type DeleteGroupMessageEventPayload = {
  userId: number;
  groupId: number;
  messageId: number;
};

export type EditGroupMessageParams = {
  user: UserEntity;
  groupId: number;
  messageId: number;
  content: string;
};

export type AddRecipientParam = {
  username: string;
  groupId: number;
  userId: number;
};
