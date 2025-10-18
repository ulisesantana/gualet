import { BaseError, Id } from '@gualet/shared';
import { TransactionsErrorCodes } from '@src/transactions/errors';

export class TransactionNotFoundError extends BaseError<TransactionsErrorCodes> {
  code = TransactionsErrorCodes.TransactionNotFound;

  constructor(id: Id) {
    super(`Transaction with id "${id.toString()}" not found.`);
  }
}
