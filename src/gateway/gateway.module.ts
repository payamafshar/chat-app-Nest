import { Module } from '@nestjs/common';
import { MessagingGateway } from './gateway';
import { databaseProviders } from 'src/database/database.provider';
import { sessionProvider } from 'src/utils/sessionProvider';
import { DatabaseModule } from 'src/database/database.module';
import { Services } from 'src/utils/constants';
import { GatewaySessionManager } from './gateway.session';
import { ConversationService } from 'src/conversation/conversation.service';
import { conversationProvider } from 'src/conversation/conversation.provider';

@Module({
  imports: [DatabaseModule],
  providers: [
    MessagingGateway,
    ...conversationProvider,
    {
      provide: Services.GATEWAY_SESSION_MANAGER,
      useClass: GatewaySessionManager,
    },
  ],
})
export class GatewayModule {}
