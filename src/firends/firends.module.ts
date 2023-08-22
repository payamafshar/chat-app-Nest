import { Module } from '@nestjs/common';
import { FirendsController } from './firends.controller';
import { FirendsService } from './firends.service';
import { DatabaseModule } from 'src/database/database.module';
import { Services } from 'src/utils/constants';
import { firendsProvider } from './firendsProvider';

@Module({
  imports: [DatabaseModule],
  controllers: [FirendsController],
  providers: [
    { provide: Services.FIRENDS, useClass: FirendsService },
    ...firendsProvider,
  ],
  exports: [{ provide: Services.FIRENDS, useClass: FirendsService }],
})
export class FirendsModule {}
