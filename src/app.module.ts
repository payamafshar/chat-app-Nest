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
  ],
  controllers: [],
  providers: [...databaseProviders, ...sessionProvider],
})
export class AppModule {}
