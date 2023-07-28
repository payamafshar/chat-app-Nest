import { UserEntity } from './typeOrm/entities/user.entity';
import { Socket } from 'socket.io';
export interface AuthenticatedSocket extends Socket {
  user?: UserEntity;
}

export interface IGatewaySessionManager {
  getUserSocket(id: number): AuthenticatedSocket;

  setUserSocket(id: number, socket: AuthenticatedSocket): void;

  removeUserSocket(id: number): void;

  getSockets(): Map<number, AuthenticatedSocket>;
}
