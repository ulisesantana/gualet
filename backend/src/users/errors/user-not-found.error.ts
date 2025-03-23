import { BaseError } from '../../common/errors';
import { UserErrorCodes } from './user.error-codes';

export class UserNotFoundError extends BaseError<UserErrorCodes> {
  code = UserErrorCodes.UserNotFound;

  constructor(id: string) {
    super(`User with id "${id}" not found.`);
  }
}
