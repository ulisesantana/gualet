import { Test } from '@nestjs/testing';
import { LoggingInterceptor } from './logging.interceptor';
import { CallHandler, ExecutionContext, Logger } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { EOL } from 'node:os';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;
  let executionContext: ExecutionContext;
  let callHandler: CallHandler;
  let loggerSpy: jest.SpyInstance;
  let errorLoggerSpy: jest.SpyInstance;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [LoggingInterceptor],
    }).compile();

    interceptor = moduleRef.get<LoggingInterceptor>(LoggingInterceptor);

    executionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          method: 'GET',
          url: '/test',
          ip: '127.0.0.1',
        }),
        getResponse: jest.fn().mockReturnValue({
          statusCode: 200,
        }),
      }),
    } as unknown as ExecutionContext;

    callHandler = {
      handle: jest.fn(),
    };

    loggerSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
    errorLoggerSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log successful request with response time', () => {
    jest.spyOn(Date, 'now').mockReturnValueOnce(1000).mockReturnValueOnce(1200);

    callHandler.handle = jest.fn().mockReturnValue(of('test'));

    interceptor.intercept(executionContext, callHandler).subscribe();

    expect(loggerSpy).toHaveBeenCalledWith('200 GET /test 200ms - 127.0.0.1');
    expect(errorLoggerSpy).not.toHaveBeenCalled();
  });

  it('should log error request with response time and error message', () => {
    jest.spyOn(Date, 'now').mockReturnValueOnce(1000).mockReturnValueOnce(1300);

    const error = new Error('Test error');
    callHandler.handle = jest.fn().mockReturnValue(throwError(() => error));

    interceptor.intercept(executionContext, callHandler).subscribe({
      error: () => {},
    });

    expect(errorLoggerSpy).toHaveBeenCalledWith(
      `200 GET /test 300ms - 127.0.0.1${EOL}Error: Test error`,
    );
    expect(loggerSpy).not.toHaveBeenCalledTimes(2);
  });

  it('should log POST request with appropriate status code', () => {
    jest.spyOn(Date, 'now').mockReturnValueOnce(1000).mockReturnValueOnce(1100);

    const httpContext = executionContext.switchToHttp();
    jest.spyOn(httpContext, 'getRequest').mockReturnValue({
      method: 'POST',
      url: '/api/users',
      ip: '192.168.1.1',
    });

    jest.spyOn(httpContext, 'getResponse').mockReturnValue({
      statusCode: 201,
    });

    callHandler.handle = jest.fn().mockReturnValue(of('test'));

    interceptor.intercept(executionContext, callHandler).subscribe();

    expect(loggerSpy).toHaveBeenCalledWith(
      '201 POST /api/users 100ms - 192.168.1.1',
    );
  });

  it('should log error request with error status code', () => {
    jest.spyOn(Date, 'now').mockReturnValueOnce(1000).mockReturnValueOnce(1050);

    const httpContext = executionContext.switchToHttp();
    jest.spyOn(httpContext, 'getResponse').mockReturnValue({
      statusCode: 500,
    });

    const error = new Error('Internal Server Error');
    callHandler.handle = jest.fn().mockReturnValue(throwError(() => error));

    interceptor.intercept(executionContext, callHandler).subscribe({
      error: () => {},
    });

    expect(errorLoggerSpy).toHaveBeenCalledWith(
      `500 GET /test 50ms - 127.0.0.1${EOL}Error: Internal Server Error`,
    );
  });

  it('should calculate response time correctly', () => {
    jest.spyOn(Date, 'now').mockReturnValueOnce(1000).mockReturnValueOnce(2500);

    callHandler.handle = jest.fn().mockReturnValue(of('test'));

    interceptor.intercept(executionContext, callHandler).subscribe();

    expect(loggerSpy).toHaveBeenCalledWith('200 GET /test 1500ms - 127.0.0.1');
  });
});
