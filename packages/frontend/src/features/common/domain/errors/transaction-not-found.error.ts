import { Id } from "@gualet/shared";
import { BaseError, ErrorCodes } from "@common/domain/errors";

export class TransactionNotFoundError extends BaseError {
  readonly code = ErrorCodes.TransactionNotFound;

  constructor(id: Id) {
    super(`Transaction with id ${id.toString()} not found.`);
    this.name = "TransactionNotFoundError";
  }
}
