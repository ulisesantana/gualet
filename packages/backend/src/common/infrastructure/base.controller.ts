import { BaseError } from '@gualet/shared';

export abstract class BaseController {
  protected isBaseError<ErrorCodes>(
    error: any,
  ): error is BaseError<ErrorCodes> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-member-access
    return error && typeof error === 'object' && error.code !== undefined;
  }
}
