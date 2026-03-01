import { ConflictException } from '@nestjs/common';
import { PaymentMethodsErrorCodes } from './payment-methods-error-codes.enum';

export class DuplicatePaymentMethodError extends ConflictException {
  constructor(name: string) {
    super({
      code: PaymentMethodsErrorCodes.DuplicatePaymentMethod,
      message: `Payment method with name "${name}" already exists`,
    });
  }
}
