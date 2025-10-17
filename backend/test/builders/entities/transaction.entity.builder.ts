import { Category } from '@src/categories';
import { PaymentMethod } from '@src/payment-methods';
import { TransactionEntity } from '@src/db';
import {
  buildCategoryEntity,
  buildPaymentMethodEntity,
  buildUserEntity,
  generateRandomId,
} from '@test/builders';
import { Id, OperationType } from '@src/common/domain';
import { Transaction } from '@src/transactions';

export function buildTransactionEntity(
  overrides: Partial<TransactionEntity> = {},
): TransactionEntity {
  const user = buildUserEntity({ id: 'user-123' });
  return {
    id: generateRandomId(),
    amount: 20.48,
    category: buildCategoryEntity({ id: 'category-123', user }),
    payment_method: buildPaymentMethodEntity({ id: 'payment-123', user }),
    user,
    description: 'Grocery Shopping',
    operation: OperationType.Outcome,
    date: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),

    ...overrides,
  } as TransactionEntity;
}

export function buildTransaction(
  overrides: Partial<TransactionEntity> = {},
): Transaction {
  const entity = buildTransactionEntity(overrides);
  return new Transaction({
    ...entity,
    category: new Category({
      id: new Id(entity.category.id),
      name: entity.category.name,
      type: entity.category.type,
      icon: entity.category.icon || undefined,
      color: entity.category.color || undefined,
    }),
    paymentMethod: new PaymentMethod({
      id: new Id(entity.payment_method.id),
      name: entity.payment_method.name,
      icon: entity.payment_method.icon || undefined,
      color: entity.payment_method.color || undefined,
    }),
  });
}
