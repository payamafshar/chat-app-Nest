import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { DatabaseModule } from 'src/database/database.module';
import { messageProvider } from './messageProvider';
import { Services } from 'src/utils/constants';
import { conversationProvider } from 'src/conversation/conversation.provider';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [DatabaseModule, EventEmitterModule.forRoot()],
  controllers: [MessageController],
  providers: [
    {
      provide: Services.MESSAGE,
      useClass: MessageService,
    },
    ...messageProvider,
    ...conversationProvider,
  ],
})
export class MessageModule {}
