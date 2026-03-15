import { Injectable } from '@nestjs/common';
import { Id, Nullable } from '@gualet/shared';
import { UserPreferences } from '@src/user-preferences/user-preferences.model';
import { DemoPaymentMethodsRepository } from './demo-payment-methods.repository';

@Injectable()
export class DemoUserPreferencesRepository {
  constructor(
    private readonly demoPaymentMethodsRepository: DemoPaymentMethodsRepository,
  ) {}

  async findByUserId(userId: Id): Promise<Nullable<UserPreferences>> {
    const paymentMethods =
      await this.demoPaymentMethodsRepository.findAll(userId);

    const firstPaymentMethod = paymentMethods[0];
    if (!firstPaymentMethod) {
      return null;
    }

    return new UserPreferences(userId, firstPaymentMethod, 'en');
  }

  async save(
    userId: Id,
    defaultPaymentMethodId: Id,
    language?: 'en' | 'es',
  ): Promise<UserPreferences> {
    const paymentMethods =
      await this.demoPaymentMethodsRepository.findAll(userId);

    const paymentMethod = paymentMethods.find((pm) =>
      pm.id.equals(defaultPaymentMethodId),
    );

    if (!paymentMethod) {
      throw new Error('Payment method not found');
    }

    return new UserPreferences(userId, paymentMethod, language || 'en');
  }
}
