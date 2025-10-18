import { Injectable } from '@nestjs/common';
import { Id } from '@gualet/shared';
import { UserPreferencesRepository } from './user-preferences.repository';
import { UserPreferences } from './user-preferences.model';
import { PaymentMethodsService } from '@src/payment-methods/payment-methods.service';

@Injectable()
export class UserPreferencesService {
  constructor(
    private readonly repository: UserPreferencesRepository,
    private readonly paymentMethodsService: PaymentMethodsService,
  ) {}

  async find(userId: Id): Promise<UserPreferences> {
    const preferences = await this.repository.findByUserId(userId);

    if (!preferences) {
      // Return default preferences with the first payment method
      const paymentMethods = await this.paymentMethodsService.findAll(userId);
      const defaultPaymentMethod = paymentMethods[0];

      if (!defaultPaymentMethod) {
        throw new Error(
          `No payment methods available for user ${userId.toString()}`,
        );
      }

      return new UserPreferences(userId, defaultPaymentMethod);
    }

    return preferences;
  }

  async save(userId: Id, defaultPaymentMethodId: Id): Promise<UserPreferences> {
    // Verify that the payment method exists and belongs to the user
    await this.paymentMethodsService.findOne(userId, defaultPaymentMethodId);

    return this.repository.save(userId, defaultPaymentMethodId);
  }
}
