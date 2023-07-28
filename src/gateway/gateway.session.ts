import {
  AuthenticatedSocket,
  IGatewaySessionManager,
} from 'src/utils/interfaces';

export class GatewaySessionManager implements IGatewaySessionManager {
  private readonly sessions: Map<number, AuthenticatedSocket> = new Map();

  getUserSocket(userId: number): AuthenticatedSocket {
    return this.sessions.get(userId);
  }

  removeUserSocket(userId: number): void {
    this.sessions.delete(userId);
  }

  getSockets(): Map<number, AuthenticatedSocket> {
    return this.sessions;
  }
  setUserSocket(userId: number, socket: AuthenticatedSocket): void {
    this.sessions.set(userId, socket);
  }
}
