import { BaseError } from '@src/common/errors';
import { Id } from '@src/common/domain';
import { TransactionsErrorCodes } from '@src/transactions/errors/transaction-error-codes.enum';

export class TransactionNotFoundError extends BaseError<TransactionsErrorCodes> {
  code = TransactionsErrorCodes.TransactionNotFound;

  constructor(id: Id) {
    super(`Transaction with id "${id.toString()}" not found.`);
  }
}
