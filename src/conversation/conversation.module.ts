import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { DatabaseModule } from 'src/database/database.module';
import { Services } from 'src/utils/constants';
import { conversationProvider } from './conversation.provider';
import { AuthService } from 'src/auth/auth.service';
import { UsersModule } from 'src/users/users.module';
import { messageProvider } from 'src/message/messageProvider';
import { ConversationMiddleware } from './middlewares/conversation.middleware';
import { isAuthorized } from 'src/utils/helper';

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
  exports: [
    {
      provide: Services.CONVERSATION,
      useClass: ConversationService,
    },
  ],
})
export class ConversationModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ConversationMiddleware).forRoutes({
      path: '/conversation/find/:id',
      method: RequestMethod.GET,
    });
  }
}
