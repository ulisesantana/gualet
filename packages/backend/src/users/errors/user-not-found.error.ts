import { UserErrorCodes } from './user.error-codes';
import { BaseError, Id } from '@gualet/shared';

export class UserNotFoundError extends BaseError<UserErrorCodes> {
  code = UserErrorCodes.UserNotFound;

  constructor(id: Id) {
    super(`User with id "${id.toString()}" not found.`);
  }
}
