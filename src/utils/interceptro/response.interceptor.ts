import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, map } from 'rxjs';

export class CustomResponse implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const response: Response = context.switchToHttp().getRequest<Response>();

    return next.handle().pipe(
      map((data) => {
        if (typeof data === 'string' && isHtml(data)) {
          // If the response data is a string containing HTML, return it as-is
          return data;
        } else {
          // Otherwise, return the data as a JSON object
          const statusCode: number = response?.statusCode ?? HttpStatus.OK;
          return {
            statusCode,
            data: data ?? {},
          };
        }
      }),
    );
  }
}

function isHtml(str: string): boolean {
  const regex = /<([A-Z][A-Z0-9]*)\b[^>]*>(.*?)<\/\1>/i;
  return regex.test(str);
}
