import { BaseError } from '@src/common/errors';
import { UserErrorCodes } from './user.error-codes';

export class UserAlreadyExistsError extends BaseError<UserErrorCodes> {
  code = UserErrorCodes.UserAlreadyExists;

  constructor(email: string) {
    super(`User with email "${email}" already exists.`);
  }
}
