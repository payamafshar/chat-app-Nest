import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';
import { ConversationModule } from './conversation/conversation.module';
import { sessionProvider } from './utils/sessionProvider';
import { databaseProviders } from './database/database.provider';
import { MessageModule } from './message/message.module';
import { GatewayModule } from './gateway/gateway.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GroupModule } from './group/group.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CustomResponse } from './utils/interceptro/response.interceptor';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    UsersModule,
    DatabaseModule,
    ConversationModule,
    MessageModule,
    GatewayModule,
    EventEmitterModule.forRoot(),
    GroupModule,
  ],
  controllers: [],
  providers: [...databaseProviders, ...sessionProvider],
})
export class AppModule {}
