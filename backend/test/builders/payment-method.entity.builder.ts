import { generateRandomId } from './generate-random-id';
import { PaymentMethodEntity } from '@src/payment-methods/entities/payment-method.entity';
import { buildUserEntity } from '@test/builders/user.entity.builder';
import { TimeString } from '@src/common/types';

export function buildPaymentMethodEntity(
  overrides: Partial<PaymentMethodEntity> = {},
): PaymentMethodEntity {
  return {
    id: generateRandomId(),
    name: 'Default Payment Method',
    icon: '💳',
    color: '#00AAFF',
    user: buildUserEntity({ id: 'user-123' }),
    createdAt: new Date().toISOString() as TimeString,
    updatedAt: new Date().toISOString() as TimeString,
    ...overrides,
  };
}
