import { UserErrorCodes } from './user.error-codes';
import { BaseError } from '@gualet/shared';

export class InvalidCredentialsError extends BaseError<UserErrorCodes> {
  code = UserErrorCodes.InvalidCredentials;

  constructor() {
    super(`Invalid credentials.`);
  }
}
