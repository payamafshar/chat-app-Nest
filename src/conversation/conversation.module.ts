import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { DatabaseModule } from 'src/database/database.module';
import { Services } from 'src/utils/constants';
import { conversationProvider } from './conversation.provider';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...conversationProvider,
    {
      provide: Services.CONVERSATION,
      useClass: ConversationService,
    },
  ],
  controllers: [ConversationController],
})
export class ConversationModule {}
