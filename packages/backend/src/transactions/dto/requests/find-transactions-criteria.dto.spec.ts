import { FindTransactionsCriteria } from './find-transactions-criteria.dto';
import { OperationType } from '@gualet/shared';

describe('FindTransactionsCriteria', () => {
  it('should create an instance with all properties', () => {
    const criteria = new FindTransactionsCriteria();
    criteria.from = '2024-01-01';
    criteria.to = '2024-12-31';
    criteria.categoryId = 'category-id';
    criteria.paymentMethodId = 'payment-method-id';
    criteria.operation = OperationType.Outcome;
    criteria.sort = 'asc';
    criteria.page = 1;
    criteria.pageSize = 10;

    expect(criteria.from).toBe('2024-01-01');
    expect(criteria.to).toBe('2024-12-31');
    expect(criteria.categoryId).toBe('category-id');
    expect(criteria.paymentMethodId).toBe('payment-method-id');
    expect(criteria.operation).toBe(OperationType.Outcome);
    expect(criteria.sort).toBe('asc');
    expect(criteria.page).toBe(1);
    expect(criteria.pageSize).toBe(10);
  });

  it('should create an instance with optional properties undefined', () => {
    const criteria = new FindTransactionsCriteria();

    expect(criteria.from).toBeUndefined();
    expect(criteria.to).toBeUndefined();
    expect(criteria.categoryId).toBeUndefined();
    expect(criteria.paymentMethodId).toBeUndefined();
    expect(criteria.operation).toBeUndefined();
    expect(criteria.sort).toBeUndefined();
    expect(criteria.page).toBeUndefined();
    expect(criteria.pageSize).toBeUndefined();
  });
});

