import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable, map } from 'rxjs';

export class RegisterInterceptor
  extends AuthGuard('local')
  implements NestInterceptor
{
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');

    const req = context.switchToHttp().getRequest();
    return next.handle().pipe(
      map(async (data) => {
        const result = (await super.canActivate(context)) as boolean;
        const request = context.switchToHttp().getRequest();
        await super.logIn(request);
        console.log('After...');
        return result;
      }),
    );
  }
}
