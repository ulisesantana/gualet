import { generateRandomId } from './generate-random-id';
import { PaymentMethodEntity } from '@src/payment-methods/entities/payment-method.entity';

export function buildPaymentMethodEntity(
  overrides: Partial<PaymentMethodEntity> = {},
): PaymentMethodEntity {
  return {
    id: generateRandomId(),
    name: 'Default Payment Method',
    icon: '💳',
    color: '#00AAFF',
    user_id: 'user-123',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}
