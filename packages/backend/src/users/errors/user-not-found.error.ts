import { BaseError } from '@src/common/errors';
import { UserErrorCodes } from './user.error-codes';
import { Id } from '@src/common/domain';

export class UserNotFoundError extends BaseError<UserErrorCodes> {
  code = UserErrorCodes.UserNotFound;

  constructor(id: Id) {
    super(`User with id "${id.toString()}" not found.`);
  }
}
