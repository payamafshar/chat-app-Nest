import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Services } from '../utils/constants';
import { UsersModule } from 'src/users/users.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LocalStrategy } from './utils/localStrategy';
import { SessionSerializer } from './utils/sessionSerializer';
import { RegisterInterceptor } from './utils/registerInterceptor';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [
    LocalStrategy,
    SessionSerializer,
    {
      provide: Services.AUTH,
      useClass: AuthService,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RegisterInterceptor,
    },
  ],
})
export class AuthModule {}
