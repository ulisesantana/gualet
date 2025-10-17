import { BaseError } from '@src/common/errors';
import { Id } from '@src/common/domain';
import { PaymentMethodsErrorCodes } from '@src/payment-methods/errors/payment-methods-error-codes.enum';

export class NotAuthorizedForTransactionError extends BaseError<PaymentMethodsErrorCodes> {
  code = PaymentMethodsErrorCodes.NotAuthorizedForPaymentMethod;

  constructor(id: Id) {
    super(`Not authorized for payment method with id "${id.toString()}".`);
  }
}
