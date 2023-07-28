import { Inject, Injectable } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { plainToInstance } from 'class-transformer';
import { NextFunction } from 'express';
import { AuthenticatedSocket } from 'src/utils/interfaces';
import { SessionEntity } from 'src/utils/typeOrm/entities/session.entity';
import * as cookieParser from 'cookie-parser';
import * as cookie from 'cookie';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from 'src/utils/typeOrm/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WebsocketAdabter extends IoAdapter {
  constructor(
    private readonly app: any,

    private readonly sessionRepository: Repository<SessionEntity>,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: any) {
    const server = super.createIOServer(port, options);

    server.use(async (socket: AuthenticatedSocket, next) => {
      console.log('Inside Websocket Adapter');

      const configService = this.app.get(ConfigService);
      const { cookie: clientCookie } = socket.handshake.headers;

      if (!clientCookie) {
        return next(new Error('Not Authenticated. No cookies were sent'));
      }
      const { CHAT_APP_SESSION_ID } = cookie.parse(clientCookie);
      if (!CHAT_APP_SESSION_ID) {
        console.log('CHAT_APP_SESSION_ID DOES NOT EXIST');
        return next(new Error('Not Authenticated'));
      }
      const signedCookie = cookieParser.signedCookie(
        CHAT_APP_SESSION_ID,
        configService.get('COOKIE_SECRET'),
      );
      console.log({ signedCookie });
      if (!signedCookie) return next(new Error('Error signing cookie'));
      const sessionDB = await this.sessionRepository.findOne({
        where: { id: signedCookie },
      });
      if (!sessionDB) return next(new Error('No session found'));
      const userFromJson = JSON.parse(sessionDB.json);
      if (!userFromJson.passport || !userFromJson.passport.user)
        return next(new Error('Passport or User object does not exist.'));
      const userDB = plainToInstance(
        UserEntity,
        JSON.parse(sessionDB.json).passport.user,
      );
      socket.user = userDB;
      next();
    });
    return server;
  }
}
