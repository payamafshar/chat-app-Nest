import { Request } from 'express';
import { UserEntity } from './typeOrm/entities/user.entity';
import { ConversationEntity } from './typeOrm/entities/conversations.entity';
import { MessageEntity } from './typeOrm/entities/messages.entity';

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
