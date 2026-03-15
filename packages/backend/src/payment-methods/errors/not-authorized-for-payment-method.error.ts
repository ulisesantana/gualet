import { BaseError, Id } from '@gualet/shared';
import { PaymentMethodsErrorCodes } from '@src/payment-methods/errors/payment-methods-error-codes.enum';

export class NotAuthorizedForPaymentMethodError extends BaseError<PaymentMethodsErrorCodes> {
  code = PaymentMethodsErrorCodes.NotAuthorizedForPaymentMethod;

  constructor(id: Id) {
    super(`Not authorized for payment method with id "${id.toString()}".`);
  }
}
