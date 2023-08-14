export enum Routes {
  AUTH = 'auth',
  USERS = 'users',
  CONVERSATION = 'conversation',
  MESSAGE = 'messages',
  GROUP = 'group',
  GROUP_MESSAGE = 'groupMessage/:groupId',
  GROUP_PARTICIPENT = 'groups/:groupId',
}

export enum Services {
  AUTH = 'AUTH_SERVICE',
  USERS = 'USERS_SERVICE',
  CONVERSATION = 'CONVERSATION_SERVICE',
  MESSAGE = 'MESSAGE_SERVICE',
  GATEWAY_SESSION_MANAGER = 'GATEWAY_SESSION_MANAGER',
  GROUP = 'GROUP_SERVICE',
  GROUP_MESSAGE = 'GROUP_MESSAGE_SERVICE',
  GROUP_PARTICIPENT = 'GROUP_PARTICIPENT',
}

export enum Repositories {
  USER = 'USER_REPOSITORY',
  CONVERSATION = 'CONVERSATION_REPOSITORY',
  MESSAGE = 'MESSAGE_REPOSITORY',
  SESSION = 'SESSION_REPOSITORY',
  GROUP = 'GROUP_REPOSITORY',
  GROUP_MESSAGE = 'GROUP_MESSAGE_REPOSITORY',
  GROUP_PARTICIPENT = 'GROUP_PARTICIPENT',
}

export const DATASOURCE_TOKEN = 'DATA_SOURCE';
