import { Module } from '@nestjs/common';
import { FirendRequestController } from './firend-request.controller';
import { FirendRequestService } from './firend-request.service';
import { Services } from 'src/utils/constants';
import { firendRequestProvider } from './firendRequestProvider';
import { UsersModule } from 'src/users/users.module';
import { DatabaseModule } from 'src/database/database.module';
import { UsersService } from 'src/users/users.service';
import { FirendsModule } from 'src/firends/firends.module';
import { firendsProvider } from 'src/firends/firendsProvider';

@Module({
  imports: [DatabaseModule, UsersModule, FirendsModule],
  controllers: [FirendRequestController],
  providers: [
    ...firendRequestProvider,
    ...firendsProvider,
    {
      provide: Services.FIREND_REQUEST,
      useClass: FirendRequestService,
    },
  ],
})
export class FirendRequestModule {}
