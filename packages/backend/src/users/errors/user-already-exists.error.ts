import { UserErrorCodes } from './user.error-codes';
import { BaseError } from '@gualet/shared';

export class UserAlreadyExistsError extends BaseError<UserErrorCodes> {
  code = UserErrorCodes.UserAlreadyExists;

  constructor(email: string) {
    super(`User with email "${email}" already exists.`);
  }
}
