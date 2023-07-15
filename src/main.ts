import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import { TypeormStore } from 'connect-typeorm';
import { Session } from './utils/typeOrm/entities/session.entity';
import { getCustomRepositoryToken, getDataSourceName } from '@nestjs/typeorm';
import dataSource from './db/dataSource';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api');

  const sessionRepository = dataSource.getRepository(Session);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.use(
    session({
      secret: configService.get('COOKIE_SECRET'),
      saveUninitialized: false,
      resave: false,
      name: 'CHAT_APP_SESSION_ID',
      cookie: {
        maxAge: 86400000, // cookie expires 1 day
      },
      store: new TypeormStore().connect(sessionRepository),
    }),
  );
  await app.listen(configService.get('PORT'));
}
bootstrap();
