import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { DatabaseModule } from 'src/database/database.module';
import { Services } from 'src/utils/constants';
import { conversationProvider } from './conversation.provider';
import { LocalStrategy } from 'src/auth/Strategy/localStrategy';
import { SessionSerializer } from 'src/auth/Strategy/sessionSerializer';
import { AuthService } from 'src/auth/auth.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [DatabaseModule, UsersModule],
  providers: [
    ...conversationProvider,

    {
      provide: Services.CONVERSATION,
      useClass: ConversationService,
    },
    {
      provide: Services.AUTH,
      useClass: AuthService,
    },
  ],
  controllers: [ConversationController],
})
export class ConversationModule {}
