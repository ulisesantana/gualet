import { PaymentMethod } from '@src/payment-methods';
import { TimeString } from '@src/common/types';
import { PaymentMethodEntity } from '@src/db';
import { buildUserEntity, generateRandomId } from '@test/builders';
import { Id } from '@src/common/domain';

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
  const entity = buildPaymentMethodEntity(overrides);
  return new PaymentMethod({
    id: new Id(entity.id),
    name: entity.name,
    icon: entity.icon || undefined,
    color: entity.color || undefined,
  });
}
