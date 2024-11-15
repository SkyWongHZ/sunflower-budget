import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  import { ResponseInterface } from '../types/types';
  
  @Injectable()
  export class TransformInterceptor<T>
    implements NestInterceptor<T, ResponseInterface<T>>
  {
    intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Observable<ResponseInterface<T>> {
      return next.handle().pipe(
        map(data => ({
          code: 200,
          data,
          msg: 'Success',
        })),
      );
    }
  }

