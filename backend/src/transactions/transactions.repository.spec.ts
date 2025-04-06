import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsRepository } from './transactions.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransactionEntity } from './entities';
import { Repository } from 'typeorm';
import {
  buildCategoryEntity,
  buildPaymentMethodEntity,
  buildTransaction,
  buildTransactionEntity,
  buildUserEntity,
} from '@test/builders';
import { Id, OperationType } from '@src/common/domain';
import {
  NotAuthorizedForTransactionError,
  TransactionNotFoundError,
} from './errors';
import {
  CategoryNotFoundError,
  NotAuthorizedForCategoryError,
} from '@src/categories/errors';
import {
  NotAuthorizedForPaymentMethodError,
  PaymentMethodNotFoundError,
} from '@src/payment-methods/errors';

import { CategoryEntity } from '@src/categories';
import { PaymentMethodEntity } from '@src/payment-methods';
import { FindTransactionsCriteria } from './dto';
import { TimeString } from '@src/common/types';
import Mocked = jest.Mocked;

describe('TransactionsRepository', () => {
  let repository: TransactionsRepository;
  let entityRepository: Repository<TransactionEntity>;
  let categoryRepository: Mocked<Repository<CategoryEntity>>;
  let paymentMethodRepository: Mocked<Repository<PaymentMethodEntity>>;

  beforeEach(async () => {
    categoryRepository = {
      findOne: jest.fn(),
    } as unknown as Mocked<Repository<CategoryEntity>>;
    paymentMethodRepository = {
      findOne: jest.fn(),
    } as unknown as Mocked<Repository<PaymentMethodEntity>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsRepository,
        {
          provide: getRepositoryToken(TransactionEntity),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            manager: {
              getRepository: jest.fn((entity) => {
                if (entity === CategoryEntity) {
                  return categoryRepository;
                }
                if (entity === PaymentMethodEntity) {
                  return paymentMethodRepository;
                }
                throw new Error(`Unknown entity: ${entity}`);
              }),
            },
          },
        },
      ],
    }).compile();

    repository = module.get<TransactionsRepository>(TransactionsRepository);
    entityRepository = module.get<Repository<TransactionEntity>>(
      getRepositoryToken(TransactionEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return a transaction when it exists and belongs to the user', async () => {
      // Arrange
      const userId = new Id('user-123');
      const transactionId = new Id('transaction-123');
      const transaction = buildTransactionEntity({
        id: transactionId.toString(),
        user: buildUserEntity({ id: userId.toString() }),
      });

      jest
        .spyOn(entityRepository, 'findOne')
        .mockResolvedValueOnce(transaction);

      // Act
      const result = await repository.findById(userId, transactionId);

      // Assert
      expect(entityRepository.findOne).toHaveBeenCalledWith({
        where: { id: transactionId.toString() },
        relations: ['category', 'payment_method', 'user'],
      });

      expect(result).toBeDefined();
      expect(result.id.toString()).toBe(transactionId.toString());
    });

    it('should throw TransactionNotFoundError when transaction does not exist', async () => {
      // Arrange
      const userId = new Id('user-123');
      const transactionId = new Id('transaction-123');

      jest.spyOn(entityRepository, 'findOne').mockResolvedValueOnce(null);

      // Act & Assert
      await expect(repository.findById(userId, transactionId)).rejects.toThrow(
        TransactionNotFoundError,
      );
    });

    it('should throw NotAuthorizedForTransactionError when transaction does not belong to user', async () => {
      // Arrange
      const userId = new Id('user-123');
      const transactionId = new Id('transaction-123');
      const transaction = buildTransactionEntity({
        id: transactionId.toString(),
        user: buildUserEntity({ id: 'different-user-id' }),
      });

      jest
        .spyOn(entityRepository, 'findOne')
        .mockResolvedValueOnce(transaction);

      // Act & Assert
      await expect(repository.findById(userId, transactionId)).rejects.toThrow(
        NotAuthorizedForTransactionError,
      );
    });
  });

  describe('find', () => {
    it('should return all transactions for the user', async () => {
      // Arrange
      const userId = new Id('user-123');
      const transactions = [
        buildTransactionEntity({
          user: buildUserEntity({ id: userId.toString() }),
        }),
        buildTransactionEntity({
          user: buildUserEntity({ id: userId.toString() }),
        }),
      ];

      const criteria: FindTransactionsCriteria = {};

      jest.spyOn(entityRepository, 'find').mockResolvedValueOnce(transactions);

      // Act
      const result = await repository.find(userId, criteria);

      // Assert
      expect(entityRepository.find).toHaveBeenCalledWith({
        where: { user: { id: userId.toString() } },
        relations: ['category', 'payment_method', 'user'],
      });

      expect(result).toHaveLength(2);
    });
  });

  describe('create', () => {
    it('should create a transaction successfully', async () => {
      // Arrange
      const userId = new Id('user-123');
      const transactionId = new Id('transaction-123');
      const categoryId = 'category-123';
      const paymentMethodId = 'payment-method-123';

      const transactionToCreate = {
        id: transactionId,
        amount: 100,
        categoryId,
        paymentMethodId,
        date: '2023-01-01T12:00:00Z' as TimeString,
        description: 'Test transaction',
        operation: OperationType.Outcome,
      };

      const category = buildCategoryEntity({
        id: categoryId,
        user: buildUserEntity({ id: userId.toString() }),
      });

      const paymentMethod = buildPaymentMethodEntity({
        id: paymentMethodId,
        user: buildUserEntity({ id: userId.toString() }),
      });

      const createdTransaction = buildTransactionEntity({
        id: transactionId.toString(),
        user: buildUserEntity({ id: userId.toString() }),
        category,
        payment_method: paymentMethod,
      });
      const newTransaction = buildTransaction(createdTransaction);

      jest.spyOn(categoryRepository, 'findOne').mockResolvedValueOnce(category);
      jest
        .spyOn(paymentMethodRepository, 'findOne')
        .mockResolvedValueOnce(paymentMethod);
      jest.spyOn(entityRepository, 'save').mockResolvedValueOnce({} as any);
      jest.spyOn(repository, 'findById').mockResolvedValueOnce(newTransaction);
      jest
        .spyOn(paymentMethodRepository, 'findOne')
        .mockResolvedValueOnce(paymentMethod);

      // Act
      const result = await repository.create(userId, transactionToCreate);

      // Assert
      expect(categoryRepository.findOne).toHaveBeenCalledWith({
        where: { id: categoryId },
      });

      expect(paymentMethodRepository.findOne).toHaveBeenCalledWith({
        where: { id: paymentMethodId },
      });

      expect(entityRepository.save).toHaveBeenCalledWith({
        id: transactionId.toString(),
        user: { id: userId.toString() },
        category: { id: categoryId },
        payment_method: { id: paymentMethodId },
        amount: 100,
        description: 'Test transaction',
        operation: OperationType.Outcome,
        date: '2023-01-01T12:00:00Z',
      });

      expect(result).toBe(newTransaction);
    });

    it('should throw CategoryNotFoundError when category does not exist', async () => {
      // Arrange
      const userId = new Id('user-123');
      const transactionId = new Id('transaction-123');
      const transactionToCreate = {
        id: transactionId,
        amount: 100,
        categoryId: 'non-existent-category',
        paymentMethodId: 'payment-method-123',
        date: '2023-01-01T12:00:00Z' as TimeString,
        description: 'Test transaction',
        operation: OperationType.Outcome,
      };

      jest.spyOn(categoryRepository, 'findOne').mockResolvedValueOnce(null);

      // Act & Assert
      await expect(
        repository.create(userId, transactionToCreate),
      ).rejects.toThrow(CategoryNotFoundError);
    });

    it('should throw NotAuthorizedForCategoryError when category does not belong to user', async () => {
      // Arrange
      const userId = new Id('user-123');
      const transactionId = new Id('transaction-123');
      const categoryId = 'category-123';

      const transactionToCreate = {
        id: transactionId,
        amount: 100,
        categoryId,
        paymentMethodId: 'payment-method-123',
        date: '2023-01-01T12:00:00Z' as TimeString,
        description: 'Test transaction',
        operation: OperationType.Outcome,
      };

      const category = buildCategoryEntity({
        id: categoryId,
        user: buildUserEntity({ id: 'different-user-id' }),
      });

      jest.spyOn(categoryRepository, 'findOne').mockResolvedValueOnce(category);

      // Act & Assert
      await expect(
        repository.create(userId, transactionToCreate),
      ).rejects.toThrow(NotAuthorizedForCategoryError);
    });

    it('should throw PaymentMethodNotFoundError when payment method does not exist', async () => {
      // Arrange
      const userId = new Id('user-123');
      const transactionId = new Id('transaction-123');
      const categoryId = 'category-123';

      const transactionToCreate = {
        id: transactionId,
        amount: 100,
        categoryId,
        paymentMethodId: 'non-existent-payment-method',
        date: '2023-01-01T12:00:00Z' as TimeString,
        description: 'Test transaction',
        operation: OperationType.Outcome,
      };

      const category = buildCategoryEntity({
        id: categoryId,
        user: buildUserEntity({ id: userId.toString() }),
      });

      jest.spyOn(categoryRepository, 'findOne').mockResolvedValueOnce(category);
      jest
        .spyOn(paymentMethodRepository, 'findOne')
        .mockResolvedValueOnce(null);

      // Act & Assert
      await expect(
        repository.create(userId, transactionToCreate),
      ).rejects.toThrow(PaymentMethodNotFoundError);
    });

    it('should throw NotAuthorizedForPaymentMethodError when payment method does not belong to user', async () => {
      // Arrange
      const userId = new Id('user-123');
      const transactionId = new Id('transaction-123');
      const categoryId = 'category-123';
      const paymentMethodId = 'payment-method-123';

      const transactionToCreate = {
        id: transactionId,
        amount: 100,
        categoryId,
        paymentMethodId,
        date: '2023-01-01T12:00:00Z' as TimeString,
        description: 'Test transaction',
        operation: OperationType.Outcome,
      };

      const category = buildCategoryEntity({
        id: categoryId,
        user: buildUserEntity({ id: userId.toString() }),
      });

      const paymentMethod = buildPaymentMethodEntity({
        id: paymentMethodId,
        user: buildUserEntity({ id: 'different-user-id' }),
      });

      jest.spyOn(categoryRepository, 'findOne').mockResolvedValueOnce(category);
      jest
        .spyOn(paymentMethodRepository, 'findOne')
        .mockResolvedValueOnce(paymentMethod);

      // Act & Assert
      await expect(
        repository.create(userId, transactionToCreate),
      ).rejects.toThrow(NotAuthorizedForPaymentMethodError);
    });
  });

  describe('update', () => {
    it('should update a transaction successfully', async () => {
      // Arrange
      const userId = new Id('user-123');
      const transactionId = new Id('transaction-123');
      const categoryId = 'category-123';
      const paymentMethodId = 'payment-method-123';

      const transactionToUpdate = {
        id: transactionId,
        amount: 200,
        categoryId,
        paymentMethodId,
        date: '2023-01-01T12:00:00Z' as TimeString,
        description: 'Updated transaction',
        operation: OperationType.Outcome,
      };

      const existingTransaction = buildTransactionEntity({
        id: transactionId.toString(),
        user: buildUserEntity({ id: userId.toString() }),
      });

      const category = buildCategoryEntity({
        id: categoryId,
        user: buildUserEntity({ id: userId.toString() }),
      });

      const paymentMethod = buildPaymentMethodEntity({
        id: paymentMethodId,
        user: buildUserEntity({ id: userId.toString() }),
      });

      const updatedTransaction = buildTransactionEntity({
        id: transactionId.toString(),
        user: buildUserEntity({ id: userId.toString() }),
        category,
        payment_method: paymentMethod,
        amount: 200,
      });

      jest
        .spyOn(entityRepository, 'findOne')
        .mockResolvedValueOnce(existingTransaction);
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValueOnce(category);
      jest
        .spyOn(paymentMethodRepository, 'findOne')
        .mockResolvedValueOnce(paymentMethod);
      jest
        .spyOn(entityRepository, 'save')
        .mockResolvedValueOnce(updatedTransaction);

      // Act
      const result = await repository.update(userId, transactionToUpdate);

      // Assert
      expect(entityRepository.findOne).toHaveBeenCalledWith({
        where: { id: transactionId.toString() },
      });

      expect(categoryRepository.findOne).toHaveBeenCalledWith({
        where: { id: categoryId },
      });

      expect(paymentMethodRepository.findOne).toHaveBeenCalledWith({
        where: { id: paymentMethodId },
      });

      expect(entityRepository.save).toHaveBeenCalledWith({
        ...transactionToUpdate,
        id: transactionId.toString(),
        user: { id: userId.toString() },
        category: { id: categoryId },
        payment_method: { id: paymentMethodId },
      });

      expect(result.id.toString()).toBe(transactionId.toString());
      expect(result.amount).toBe(updatedTransaction.amount);
    });

    it('should throw TransactionNotFoundError when transaction does not exist', async () => {
      // Arrange
      const userId = new Id('user-123');
      const transactionId = new Id('transaction-123');

      const transactionToUpdate = {
        id: transactionId,
        amount: 200,
        categoryId: 'category-123',
        paymentMethodId: 'payment-method-123',
        date: '2023-01-01T12:00:00Z' as TimeString,
        description: 'Updated transaction',
        operation: OperationType.Outcome,
      };

      jest.spyOn(entityRepository, 'findOne').mockResolvedValueOnce(null);

      // Act & Assert
      await expect(
        repository.update(userId, transactionToUpdate),
      ).rejects.toThrow(TransactionNotFoundError);
    });

    it('should throw NotAuthorizedForTransactionError when transaction does not belong to user', async () => {
      // Arrange
      const userId = new Id('user-123');
      const transactionId = new Id('transaction-123');

      const transactionToUpdate = {
        id: transactionId,
        amount: 200,
        categoryId: 'category-123',
        paymentMethodId: 'payment-method-123',
        date: '2023-01-01T12:00:00Z' as TimeString,
        description: 'Updated transaction',
        operation: OperationType.Outcome,
      };

      const existingTransaction = buildTransactionEntity({
        id: transactionId.toString(),
        user: buildUserEntity({ id: 'different-user-id' }),
      });

      jest
        .spyOn(entityRepository, 'findOne')
        .mockResolvedValueOnce(existingTransaction);

      // Act & Assert
      await expect(
        repository.update(userId, transactionToUpdate),
      ).rejects.toThrow(NotAuthorizedForTransactionError);
    });

    // The validation tests for category and payment method are similar to create method
    // and would be duplicative, so they're omitted for brevity
  });
});
