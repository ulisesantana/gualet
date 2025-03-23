import { Id } from "@domain/models";
import { BaseError, ErrorCodes } from "@domain/errors";

export class TransactionNotFoundError extends BaseError {
  readonly code = ErrorCodes.TransactionNotFound;

  constructor(id: Id) {
    super(`Transaction with id ${id.toString()} not found.`);
    this.name = "TransactionNotFoundError";
  }
}
