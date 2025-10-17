import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { EOL } from 'node:os';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url, ip } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const { responseTime, statusCode } = this.getResponseInfo(
            context,
            startTime,
          );

          this.logger.log(
            `${statusCode} ${method} ${url} ${responseTime}ms - ${ip}`,
          );
        },
        error: (error) => {
          const { responseTime, statusCode } = this.getResponseInfo(
            context,
            startTime,
          );

          this.logger.error(
            `${statusCode} ${method} ${url} ${responseTime}ms - ${ip}${EOL}${error}`,
          );
        },
      }),
    );
  }

  private getResponseInfo(context: ExecutionContext, startTime: number) {
    const response = context.switchToHttp().getResponse<Response>();
    const responseTime = Date.now() - startTime;
    const statusCode = response.statusCode;
    return { responseTime, statusCode };
  }
}
