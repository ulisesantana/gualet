import { BaseError, Id } from '@gualet/shared';
import { PaymentMethodsErrorCodes } from './payment-methods-error-codes.enum';

export class PaymentMethodInUseError extends BaseError<PaymentMethodsErrorCodes> {
  code = PaymentMethodsErrorCodes.PaymentMethodInUse;

  constructor(id: Id) {
    super(`Payment method ${id.toString()} is in use and cannot be deleted`);
  }
}
