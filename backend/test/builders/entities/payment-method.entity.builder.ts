import { PaymentMethod, PaymentMethodEntity } from '@src/payment-methods';
import { TimeString } from '@src/common/types';
import { generateRandomId } from '../generate-random-id';
import { buildUserEntity } from './user.entity.builder';

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

export function buildPaymentMethod(
  overrides: Partial<PaymentMethodEntity> = {},
): PaymentMethod {
  return new PaymentMethod({
    id: generateRandomId(),
    name: 'Default Payment Method',
    icon: '💳',
    color: '#00AAFF',
    user: buildUserEntity({ id: 'user-123' }),
    createdAt: new Date().toISOString() as TimeString,
    updatedAt: new Date().toISOString() as TimeString,
    ...overrides,
  });
}
