import { UserErrorCodes } from './user.error-codes';
import { BaseError, Id } from '@gualet/shared';

export class UserNotFoundError extends BaseError<UserErrorCodes> {
  code = UserErrorCodes.UserNotFound;

  constructor(idOrEmail: Id | string) {
    const message =
      idOrEmail instanceof Id
        ? `User with id "${idOrEmail.toString()}" not found.`
        : `User not found.`;
    super(message);
  }
}
