import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { GroupController } from './contorllers/group.controller';
import { GroupService } from './services/group.service';
import { Services } from 'src/utils/constants';
import { UsersModule } from 'src/users/users.module';
import { userProvider } from 'src/users/user.providers';
import { DatabaseModule } from 'src/database/database.module';
import { groupMessageProvider, groupProvider } from './groupProvider';
import { GroupMessageController } from './contorllers/group-message.controller';
import { GroupMessageService } from './services/group-message.service';
import { GroupParticipentController } from './contorllers/group-participent.controller';
import { GroupParticipentService } from './services/group-participent.service';
import { GroupMiddleWare } from './middlewares/group.middleware';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [
    GroupController,
    GroupMessageController,
    GroupParticipentController,
  ],
  providers: [
    ...userProvider,
    ...groupProvider,
    ...groupMessageProvider,
    {
      provide: Services.GROUP,
      useClass: GroupService,
    },
    {
      provide: Services.GROUP_MESSAGE,
      useClass: GroupMessageService,
    },
    {
      provide: Services.GROUP_PARTICIPENT,
      useClass: GroupParticipentService,
    },
  ],
  exports: [
    {
      provide: Services.GROUP,
      useClass: GroupService,
    },
  ],
})
export class GroupModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GroupMiddleWare).forRoutes({
      path: '/group/find/:groupId',
      method: RequestMethod.GET,
    });
  }
}
