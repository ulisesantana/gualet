import { BaseError } from '@src/common/errors';
import { UserErrorCodes } from './user.error-codes';

export class InvalidCredentialsError extends BaseError<UserErrorCodes> {
  code = UserErrorCodes.InvalidCredentials;

  constructor() {
    super(`Invalid credentials.`);
  }
}
