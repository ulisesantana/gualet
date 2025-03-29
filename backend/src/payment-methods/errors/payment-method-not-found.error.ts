import { BaseError } from '@src/common/errors';
import { Id } from '@src/common/domain';
import { PaymentMethodsErrorCodes } from './payment-methods-error-codes.enum';

export class PaymentMethodNotFoundError extends BaseError<PaymentMethodsErrorCodes> {
  code = PaymentMethodsErrorCodes.PaymentMethodNotFound;

  constructor(id: Id) {
    super(`Payment method with id "${id.toString()}" not found.`);
  }
}
