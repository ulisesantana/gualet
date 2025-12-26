import { TransactionNotFoundError } from './errors';
import { Id, OperationType, TimeString } from '@gualet/shared';
import { Transaction } from './transaction.model';
import {
  TransactionsService,
  TransactionToUpdate,
} from '@src/transactions/transactions.service';
import { TransactionsRepository } from '@src/transactions/transactions.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { buildTransaction, buildUserEntity } from '@test/builders';
import { Pagination } from '@src/common/infrastructure';
import { TransactionEntity } from '@src/db';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let repository: TransactionsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        TransactionsRepository,
        {
          provide: getRepositoryToken(TransactionEntity),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            manager: {
              getRepository: jest.fn().mockReturnValue({ findOne: jest.fn() }),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    repository = module.get<TransactionsRepository>(TransactionsRepository);
  });

  it('should create a transaction', async () => {
    const transactionToCreate = {
      id: new Id(),
      name: 'transaction-name',
      amount: 100,
      type: OperationType.Outcome,
      operation: OperationType.Outcome,
      date: new Date().toISOString() as TimeString,
      categoryId: 'category1',
      paymentMethodId: 'payment1',
    };
    const userId = new Id();
    const createdTransaction = buildTransaction({
      amount: transactionToCreate.amount,
    });

    jest.spyOn(repository, 'create').mockResolvedValue(createdTransaction);

    const result = await service.create(userId, transactionToCreate);

    expect(result).toEqual(createdTransaction);
  });

  it('should find transactions with default criteria', async () => {
    const userId = new Id();
    const transactions = [{ id: new Id(), amount: 100 }] as Transaction[];
    const pagination = new Pagination({ total: 1, page: 1, pageSize: 10 });

    jest
      .spyOn(repository, 'find')
      .mockResolvedValue({ transactions, pagination });

    const result = await service.find(userId, {});

    expect(result).toEqual({ transactions, pagination });
    expect(repository.find).toHaveBeenCalledWith(userId, {
      sort: 'asc',
      page: 1,
      pageSize: 10,
    });
  });

  it('should find a transaction by id', async () => {
    const userId = new Id();
    const transactionId = new Id();
    const transaction = { id: transactionId, amount: 100 } as Transaction;

    jest.spyOn(repository, 'findById').mockResolvedValue(transaction);

    const result = await service.findById(userId, transactionId);

    expect(result).toEqual(transaction);
  });

  it('should update a transaction', async () => {
    const userId = new Id();
    const transactionToUpdate: TransactionToUpdate = {
      id: new Id(),
      amount: 200,
    };
    const existingTransaction = buildTransaction({
      user: buildUserEntity({ id: userId.toString() }),
      amount: 100,
    });
    const updatedTransaction = {
      ...existingTransaction,
      ...transactionToUpdate,
    };

    jest.spyOn(repository, 'findById').mockResolvedValue(existingTransaction);
    jest.spyOn(repository, 'update').mockResolvedValue(
      new Transaction({
        ...existingTransaction,
        amount: transactionToUpdate.amount!,
      }),
    );

    const result = await service.update(userId, transactionToUpdate);

    expect(result).toEqual(
      expect.objectContaining({
        ...updatedTransaction,
        id: expect.any(Id),
      }),
    );
  });

  it('should throw an error when updating a non-existent transaction', async () => {
    const userId = new Id();
    const transactionToUpdate = { id: new Id(), amount: 200 };

    jest
      .spyOn(repository, 'findById')
      .mockRejectedValue(new TransactionNotFoundError(transactionToUpdate.id));

    await expect(service.update(userId, transactionToUpdate)).rejects.toThrow(
      TransactionNotFoundError,
    );
  });

  it('should delete a transaction', async () => {
    const userId = new Id();
    const transactionId = new Id();
    const existingTransaction = {
      id: transactionId,
      amount: 100,
    } as Transaction;

    jest.spyOn(repository, 'findById').mockResolvedValue(existingTransaction);
    jest.spyOn(repository, 'delete').mockResolvedValue();

    await service.delete(userId, transactionId);

    expect(repository.delete).toHaveBeenCalledWith(userId, transactionId);
  });

  it('should throw an error when deleting a non-existent transaction', async () => {
    const userId = new Id();
    const transactionId = new Id();

    jest
      .spyOn(repository, 'findById')
      .mockRejectedValue(new TransactionNotFoundError(transactionId));

    await expect(service.delete(userId, transactionId)).rejects.toThrow(
      TransactionNotFoundError,
    );
  });
});
