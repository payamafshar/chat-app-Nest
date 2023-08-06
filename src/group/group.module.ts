import { Module } from '@nestjs/common';
import { GroupController } from './contorllers/group.controller';
import { GroupService } from './services/group.service';
import { Services } from 'src/utils/constants';
import { UsersModule } from 'src/users/users.module';
import { userProvider } from 'src/users/user.providers';
import { DatabaseModule } from 'src/database/database.module';
import { groupProvider } from './groupProvider';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [GroupController],
  providers: [
    ...userProvider,
    ...groupProvider,
    {
      provide: Services.GROUP,
      useClass: GroupService,
    },
  ],
})
export class GroupModule {}
