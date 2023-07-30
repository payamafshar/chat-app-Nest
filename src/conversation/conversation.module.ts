import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { DatabaseModule } from 'src/database/database.module';
import { Services } from 'src/utils/constants';
import { conversationProvider } from './conversation.provider';
import { AuthService } from 'src/auth/auth.service';
import { UsersModule } from 'src/users/users.module';
import { messageProvider } from 'src/message/messageProvider';

@Module({
  imports: [DatabaseModule, UsersModule],
  providers: [
    ...conversationProvider,
    ...messageProvider,
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
