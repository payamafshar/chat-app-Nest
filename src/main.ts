import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import { TypeormStore } from 'connect-typeorm';
import { SessionEntity } from './utils/typeOrm/entities/session.entity';
import { Connection, DataSource, getRepository } from 'typeorm';
import { databaseProviders } from './database/database.provider';
import * as passport from 'passport';
import { WebsocketAdabter } from './gateway/gateway.adapter';
import { CustomResponse } from './utils/interceptro/response.interceptor';
// import dataSource from './db/dataSource';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const dataSource = app.get<DataSource>('DATA_SOURCE');
  const sessionRepo = dataSource.getRepository(SessionEntity);
  const adapter = new WebsocketAdabter(app, sessionRepo);
  app.useWebSocketAdapter(adapter);
  app.enableCors({
    origin: [configService.get('CORS_ORIGIN')],
    credentials: true,
  });
  app.use(
    session({
      secret: configService.get('COOKIE_SECRET'),
      saveUninitialized: false,
      resave: false,
      name: 'CHAT_APP_SESSION_ID',
      cookie: {
        maxAge: 86400000, // cookie expires 1 day
      },
      store: new TypeormStore().connect(sessionRepo),
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(configService.get('PORT'));
}
bootstrap();
