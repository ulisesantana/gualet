import { Id, Language, PaymentMethod } from '@gualet/shared';

export class UserPreferences {
  constructor(
    public readonly userId: Id,
    public readonly defaultPaymentMethod: PaymentMethod,
    public readonly language: Language = 'en',
  ) {}
}
