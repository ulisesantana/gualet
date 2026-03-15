import { Injectable } from '@nestjs/common';
import { Id } from '@gualet/shared';
import { UserPreferencesRepositoryFactory } from './user-preferences.repository.factory';
import { UserPreferences } from './user-preferences.model';
import { PaymentMethodsService } from '@src/payment-methods/payment-methods.service';

@Injectable()
export class UserPreferencesService {
  constructor(
    private readonly repositoryFactory: UserPreferencesRepositoryFactory,
    private readonly paymentMethodsService: PaymentMethodsService,
  ) {}

  async find(userId: Id): Promise<UserPreferences | null> {
    const repository = this.repositoryFactory.getRepository();
    const preferences = await repository.findByUserId(userId);

    if (!preferences) {
      // Return default preferences with the first payment method
      const paymentMethods = await this.paymentMethodsService.findAll(userId);
      const defaultPaymentMethod = paymentMethods[0];

      if (!defaultPaymentMethod) {
        // Return null if no payment methods available
        return null;
      }

      return new UserPreferences(userId, defaultPaymentMethod, 'en');
    }

    return preferences;
  }

  async save(
    userId: Id,
    defaultPaymentMethodId: Id,
    language?: 'en' | 'es',
  ): Promise<UserPreferences> {
    // Verify that the payment method exists and belongs to the user
    await this.paymentMethodsService.findOne(userId, defaultPaymentMethodId);

    const repository = this.repositoryFactory.getRepository();
    return repository.save(userId, defaultPaymentMethodId, language);
  }
}
