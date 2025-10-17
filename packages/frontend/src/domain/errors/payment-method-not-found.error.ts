import { Id } from "@gualet/shared";
import { BaseError, ErrorCodes } from "@domain/errors";

export class PaymentMethodNotFoundError extends BaseError {
  readonly code = ErrorCodes.PaymentMethodNotFound;

  constructor(id: Id) {
    super(`Payment method with id ${id.toString()} not found.`);
    this.name = "PaymentMethodNotFoundError";
  }
}
