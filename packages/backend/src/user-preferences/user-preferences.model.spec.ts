import { UserPreferences } from './user-preferences.model';
import { Id } from '@gualet/shared';
import { buildPaymentMethod } from '@test/builders';

describe('UserPreferences', () => {
  it('should create a UserPreferences instance', () => {
    const userId = new Id('user-123');
    const paymentMethod = buildPaymentMethod();

    const preferences = new UserPreferences(userId, paymentMethod);

    expect(preferences.userId).toEqual(userId);
    expect(preferences.defaultPaymentMethod).toEqual(paymentMethod);
  });

  it('should store the correct userId', () => {
    const userId = new Id('user-456');
    const paymentMethod = buildPaymentMethod();

    const preferences = new UserPreferences(userId, paymentMethod);

    expect(preferences.userId.value).toBe('user-456');
  });

  it('should store the correct default payment method', () => {
    const userId = new Id('user-123');
    const paymentMethod = buildPaymentMethod({
      id: 'pm-789',
      name: 'Credit Card',
    });

    const preferences = new UserPreferences(userId, paymentMethod);

    expect(preferences.defaultPaymentMethod.id.value).toBe('pm-789');
    expect(preferences.defaultPaymentMethod.name).toBe('Credit Card');
  });
});
