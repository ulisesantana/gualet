import { Test, TestingModule } from '@nestjs/testing';
import { DemoTransactionsRepository } from '../repositories/demo-transactions.repository';
import { DemoService } from '../demo.service';
import { Id, OperationType, TimeString } from '@gualet/shared';
import { TransactionNotFoundError } from '@src/transactions/errors';
import { CategoryNotFoundError } from '@src/categories/errors';
import { PaymentMethodNotFoundError } from '@src/payment-methods/errors';

describe('DemoTransactionsRepository', () => {
  let repository: DemoTransactionsRepository;
  let demoService: DemoService;
  const userId = new Id('demo-user-id');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DemoTransactionsRepository, DemoService],
    }).compile();

    repository = module.get<DemoTransactionsRepository>(
      DemoTransactionsRepository,
    );
    demoService = module.get<DemoService>(DemoService);
    demoService.onModuleInit();
  });

  afterEach(() => {
    demoService.onModuleDestroy();
  });

  describe('findById', () => {
    it('should return a transaction by id', async () => {
      const transactions = demoService.getTransactions();
      const firstTxData = Array.from(transactions.values())[0];

      const tx = await repository.findById(userId, new Id(firstTxData.id));

      expect(tx).toBeDefined();
      expect(tx.id.toString()).toBe(firstTxData.id);
      expect(tx.amount).toBe(firstTxData.amount);
    });

    it('should throw TransactionNotFoundError if not found', async () => {
      await expect(
        repository.findById(userId, new Id('non-existent')),
      ).rejects.toThrow(TransactionNotFoundError);
    });
  });

  describe('create', () => {
    it('should create a new transaction', async () => {
      const categories = demoService.getCategories();
      const paymentMethods = demoService.getPaymentMethods();
      const firstCat = Array.from(categories.values())[0];
      const firstPm = Array.from(paymentMethods.values())[0];

      const newTx = {
        id: new Id('new-tx'),
        amount: -50.0,
        description: 'Test transaction',
        operation: OperationType.Outcome,
        date: new Date().toISOString() as TimeString,
        categoryId: firstCat.id.toString(),
        paymentMethodId: firstPm.id.toString(),
      };

      const created = await repository.create(userId, newTx);

      expect(created).toBeDefined();
      expect(created.amount).toBe(-50.0);
      expect(created.description).toBe('Test transaction');
    });

    it('should throw CategoryNotFoundError if category does not exist', async () => {
      const paymentMethods = demoService.getPaymentMethods();
      const firstPm = Array.from(paymentMethods.values())[0];

      const newTx = {
        id: new Id('new-tx'),
        amount: -50.0,
        description: 'Test',
        operation: OperationType.Outcome,
        date: new Date().toISOString() as TimeString,
        categoryId: 'non-existent',
        paymentMethodId: firstPm.id.toString(),
      };

      await expect(repository.create(userId, newTx)).rejects.toThrow(
        CategoryNotFoundError,
      );
    });

    it('should throw PaymentMethodNotFoundError if payment method does not exist', async () => {
      const categories = demoService.getCategories();
      const firstCat = Array.from(categories.values())[0];

      const newTx = {
        id: new Id('new-tx'),
        amount: -50.0,
        description: 'Test',
        operation: OperationType.Outcome,
        date: new Date().toISOString() as TimeString,
        categoryId: firstCat.id.toString(),
        paymentMethodId: 'non-existent',
      };

      await expect(repository.create(userId, newTx)).rejects.toThrow(
        PaymentMethodNotFoundError,
      );
    });
  });

  describe('find', () => {
    it('should return all transactions with default criteria', async () => {
      const result = await repository.find(userId, {
        sort: 'desc',
        page: 1,
        pageSize: 10,
      });

      expect(result.transactions).toBeDefined();
      expect(result.transactions.length).toBeGreaterThan(0);
      expect(result.pagination).toBeDefined();
    });

    it('should filter by category', async () => {
      const categories = demoService.getCategories();
      const firstCat = Array.from(categories.values())[0];

      const result = await repository.find(userId, {
        categoryId: firstCat.id.toString(),
        sort: 'desc',
        page: 1,
        pageSize: 10,
      });

      result.transactions.forEach((tx) => {
        expect(tx.category.id.toString()).toBe(firstCat.id.toString());
      });
    });

    it('should filter by payment method', async () => {
      const paymentMethods = demoService.getPaymentMethods();
      const firstPm = Array.from(paymentMethods.values())[0];

      const result = await repository.find(userId, {
        paymentMethodId: firstPm.id.toString(),
        sort: 'desc',
        page: 1,
        pageSize: 10,
      });

      result.transactions.forEach((tx) => {
        expect(tx.paymentMethod.id.toString()).toBe(firstPm.id.toString());
      });
    });

    it('should filter by operation', async () => {
      const result = await repository.find(userId, {
        operation: OperationType.Outcome,
        sort: 'desc',
        page: 1,
        pageSize: 10,
      });

      result.transactions.forEach((tx) => {
        expect(tx.operation).toBe(OperationType.Outcome);
      });
    });

    it('should sort transactions ascending', async () => {
      const result = await repository.find(userId, {
        sort: 'asc',
        page: 1,
        pageSize: 100,
      });

      for (let i = 1; i < result.transactions.length; i++) {
        const prevDate = new Date(result.transactions[i - 1].date);
        const currDate = new Date(result.transactions[i].date);
        expect(currDate.getTime()).toBeGreaterThanOrEqual(prevDate.getTime());
      }
    });

    it('should sort transactions descending', async () => {
      const result = await repository.find(userId, {
        sort: 'desc',
        page: 1,
        pageSize: 100,
      });

      for (let i = 1; i < result.transactions.length; i++) {
        const prevDate = new Date(result.transactions[i - 1].date);
        const currDate = new Date(result.transactions[i].date);
        expect(currDate.getTime()).toBeLessThanOrEqual(prevDate.getTime());
      }
    });

    it('should paginate results', async () => {
      const page1 = await repository.find(userId, {
        sort: 'desc',
        page: 1,
        pageSize: 5,
      });

      const page2 = await repository.find(userId, {
        sort: 'desc',
        page: 2,
        pageSize: 5,
      });

      expect(page1.transactions.length).toBeLessThanOrEqual(5);
      expect(page2.transactions.length).toBeLessThanOrEqual(5);

      if (page1.transactions.length > 0 && page2.transactions.length > 0) {
        expect(page1.transactions[0].id.equals(page2.transactions[0].id)).toBe(
          false,
        );
      }
    });

    it('should return all transactions when pageSize is 0', async () => {
      const result = await repository.find(userId, {
        sort: 'desc',
        page: 1,
        pageSize: 0,
      });

      expect(result.transactions.length).toBe(result.pagination.total);
    });
  });

  describe('update', () => {
    it('should update an existing transaction', async () => {
      const transactions = demoService.getTransactions();
      const txData = Array.from(transactions.values())[0];

      const updatedTx = await repository.update(userId, {
        id: new Id(txData.id),
        amount: -999.99,
        description: 'Updated',
        operation: txData.operation,
        date: txData.date as TimeString,
        categoryId: txData.categoryId,
        paymentMethodId: txData.paymentMethodId,
      });

      expect(updatedTx.amount).toBe(-999.99);
      expect(updatedTx.description).toBe('Updated');
    });

    it('should throw TransactionNotFoundError if not found', async () => {
      const categories = demoService.getCategories();
      const paymentMethods = demoService.getPaymentMethods();

      await expect(
        repository.update(userId, {
          id: new Id('non-existent'),
          amount: -50,
          description: 'Test',
          operation: OperationType.Outcome,
          date: new Date().toISOString() as TimeString,
          categoryId: Array.from(categories.values())[0].id.toString(),
          paymentMethodId: Array.from(paymentMethods.values())[0].id.toString(),
        }),
      ).rejects.toThrow(TransactionNotFoundError);
    });
  });

  describe('delete', () => {
    it('should delete a transaction', async () => {
      const transactions = demoService.getTransactions();
      const txData = Array.from(transactions.values())[0];
      const txId = new Id(txData.id);

      await repository.delete(userId, txId);

      await expect(repository.findById(userId, txId)).rejects.toThrow(
        TransactionNotFoundError,
      );
    });

    it('should throw TransactionNotFoundError if not found', async () => {
      await expect(
        repository.delete(userId, new Id('non-existent')),
      ).rejects.toThrow(TransactionNotFoundError);
    });
  });

  describe('data isolation', () => {
    it('should not persist data after service reset', async () => {
      const categories = demoService.getCategories();
      const paymentMethods = demoService.getPaymentMethods();

      const newTx = {
        id: new Id('temp-tx'),
        amount: -100,
        description: 'Temporary',
        operation: OperationType.Outcome,
        date: new Date().toISOString() as TimeString,
        categoryId: Array.from(categories.values())[0].id.toString(),
        paymentMethodId: Array.from(paymentMethods.values())[0].id.toString(),
      };

      await repository.create(userId, newTx);
      const found = await repository.findById(userId, newTx.id);
      expect(found).toBeDefined();

      // Reset
      demoService.onModuleInit();

      await expect(repository.findById(userId, newTx.id)).rejects.toThrow(
        TransactionNotFoundError,
      );
    });
  });
});
