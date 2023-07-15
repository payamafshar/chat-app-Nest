import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Services } from 'src/utils/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/utils/typeOrm/entities/user.entity';
import { DatabaseModule } from 'src/database/database.module';
import { DataSource } from 'typeorm';
import { userProvider } from './user.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [
    ...userProvider,
    {
      provide: Services.USERS,
      useClass: UsersService,
    },
  ],
  exports: [
    {
      provide: Services.USERS,
      useClass: UsersService,
    },
  ],
})
export class UsersModule {}

//TypeOrmModule.forFeature([UserEntity])
