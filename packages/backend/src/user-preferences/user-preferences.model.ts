import { Id, PaymentMethod } from '@gualet/shared';

export class UserPreferences {
  constructor(
    public readonly userId: Id,
    public readonly defaultPaymentMethod: PaymentMethod,
  ) {}
}
