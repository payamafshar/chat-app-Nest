import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable, map, tap } from 'rxjs';
import { SessionSerializer } from './sessionSerializer';
import { UserEntity } from 'src/utils/typeOrm/entities/user.entity';

@Injectable()
export class RegisterInterceptor
  extends AuthGuard('local')
  implements NestInterceptor
{
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');

    const req = context.switchToHttp().getRequest();
    return next.handle().pipe(
      map(async (data: UserEntity) => {
        if (data?.username) {
          const result = (await super.canActivate(context)) as boolean;
          const request = context.switchToHttp().getRequest();
          await super.logIn(request);
        }
      }),
    );
  }
}
