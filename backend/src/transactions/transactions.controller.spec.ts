import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, UpdateTransactionDto } from './dto';
import { Id, OperationType } from '@src/common/domain';
import { buildFindTransactionsCriteria } from '@test/builders/dto/find-transactions-criteria.dto.builder';
import { buildTransaction } from '@test/builders/entities/transaction.entity.builder';
import { TimeString } from '@src/common/types';
import { AuthenticatedRequest, Pagination } from '@src/common/infrastructure';
import { TransactionNotFoundError } from '@src/transactions/errors';
import { Response } from 'express';
import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import Mocked = jest.Mocked;

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let transactionsService: TransactionsService;
  let res: Mocked<Response>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    transactionsService = module.get<TransactionsService>(TransactionsService);
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn((x: unknown) => x),
    } as unknown as Mocked<Response>;
  });

  describe('create', () => {
    it('should create a transaction successfully', async () => {
      const createDto: CreateTransactionDto = {
        amount: 100,
        description: 'Test transaction',
        categoryId: 'category-123',
        paymentMethodId: 'payment-123',
        operation: OperationType.Outcome,
        date: '2023-01-01' as TimeString,
      };
      const req = { user: { userId: 'user-123' } };
      const transaction = buildTransaction();

      jest.spyOn(transactionsService, 'create').mockResolvedValue(transaction);

      await controller.create(createDto, req as AuthenticatedRequest, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        error: null,
        data: { transaction: transaction.toJSON() },
        pagination: null,
      });
      expect(transactionsService.create).toHaveBeenCalledWith(
        expect.any(Id),
        createDto,
      );
    });

    it('should throw InternalServerErrorException when service fails', async () => {
      const createDto: CreateTransactionDto = {
        amount: 100,
        operation: OperationType.Outcome,
        description: 'Test transaction',
        categoryId: 'category-123',
        paymentMethodId: 'payment-123',
        date: '2023-01-01' as TimeString,
      };
      const req = { user: { userId: 'user-123' } };
      const expectedError = new Error('Database error');

      jest
        .spyOn(transactionsService, 'create')
        .mockRejectedValue(expectedError);

      await controller.create(createDto, req as AuthenticatedRequest, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        error: new InternalServerErrorException(expectedError),
        data: null,
        pagination: null,
      });
    });
  });

  describe('findAll', () => {
    it('should find all transactions successfully', async () => {
      const criteria = buildFindTransactionsCriteria();
      const req = { user: { userId: 'user-123' } };
      const transactions = [buildTransaction(), buildTransaction()];
      const pagination = new Pagination({ total: 2, page: 1, pageSize: 25 });

      jest.spyOn(transactionsService, 'find').mockResolvedValue({
        transactions,
        pagination,
      });

      await controller.findAll(criteria, req as AuthenticatedRequest, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        error: null,
        data: { transactions: transactions.map((t) => t.toJSON()) },
        pagination,
      });
      expect(transactionsService.find).toHaveBeenCalledWith(
        expect.any(Id),
        criteria,
      );
    });

    it('should throw InternalServerErrorException when service fails', async () => {
      const criteria = buildFindTransactionsCriteria();
      const req = { user: { userId: 'user-123' } };
      const expectedError = new Error('Database error');

      jest.spyOn(transactionsService, 'find').mockRejectedValue(expectedError);

      await controller.findAll(criteria, req as AuthenticatedRequest, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        error: new InternalServerErrorException(expectedError),
        data: null,
        pagination: null,
      });
    });
  });

  describe('findOne', () => {
    it('should find one transaction by id successfully', async () => {
      const transactionId = 'transaction-123';
      const req = { user: { userId: 'user-123' } };
      const transaction = buildTransaction({ id: transactionId });

      jest
        .spyOn(transactionsService, 'findById')
        .mockResolvedValue(transaction);

      await controller.findOne(transactionId, req as AuthenticatedRequest, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        error: null,
        data: { transaction: transaction.toJSON() },
        pagination: null,
      });
      expect(transactionsService.findById).toHaveBeenCalledWith(
        new Id(req.user.userId),
        new Id(transactionId),
      );
    });

    it('should throw InternalServerErrorException when service fails', async () => {
      const transactionId = 'transaction-123';
      const req = { user: { userId: 'user-123' } };
      const expectedError = new Error('Transaction not found');

      jest
        .spyOn(transactionsService, 'findById')
        .mockRejectedValue(expectedError);

      await controller.findOne(transactionId, req as AuthenticatedRequest, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        error: new InternalServerErrorException(expectedError),
        data: null,
        pagination: null,
      });
    });
  });

  describe('update', () => {
    it('should update a transaction successfully', async () => {
      const transactionId = 'transaction-123';
      const updateDto: UpdateTransactionDto = {
        amount: 200,
        description: 'Updated transaction',
      };
      const req = { user: { userId: 'user-123' } };
      const transaction = buildTransaction({
        id: transactionId,
        amount: 200,
        description: 'Updated transaction',
      });

      jest.spyOn(transactionsService, 'update').mockResolvedValue(transaction);

      await controller.update(
        transactionId,
        req as AuthenticatedRequest,
        res,
        updateDto,
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        error: null,
        data: { transaction: transaction.toJSON() },
        pagination: null,
      });
      expect(transactionsService.update).toHaveBeenCalledWith(
        expect.any(Id),
        expect.objectContaining({
          ...updateDto,
          id: expect.any(Id),
        }),
      );
    });

    it('should throw InternalServerErrorException when service fails', async () => {
      const transactionId = 'transaction-123';
      const updateDto: UpdateTransactionDto = { amount: 200 };
      const req = { user: { userId: 'user-123' } };
      const expectedError = new Error('Transaction not found');

      jest
        .spyOn(transactionsService, 'update')
        .mockRejectedValue(expectedError);

      await controller.update(
        transactionId,
        req as AuthenticatedRequest,
        res,
        updateDto,
      );

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        error: new InternalServerErrorException(expectedError),
        data: null,
        pagination: null,
      });
    });
  });

  describe('remove', () => {
    it('should delete a transaction successfully', async () => {
      const transactionId = 'transaction-123';
      const req = { user: { userId: 'user-123' } };

      jest.spyOn(transactionsService, 'delete').mockResolvedValue(undefined);

      await controller.remove(transactionId, req as AuthenticatedRequest, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        error: null,
        data: null,
        pagination: null,
      });
      expect(transactionsService.delete).toHaveBeenCalledWith(
        new Id(req.user.userId),
        new Id(transactionId),
      );
    });

    it('should throw InternalServerErrorException when service fails', async () => {
      const transactionId = 'transaction-123';
      const req = { user: { userId: 'user-123' } };
      const expectedError = new Error('Transaction not found');

      jest
        .spyOn(transactionsService, 'delete')
        .mockRejectedValue(expectedError);

      await controller.remove(transactionId, req as AuthenticatedRequest, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        error: new InternalServerErrorException(expectedError),
        data: null,
        pagination: null,
      });
    });
  });

  it('should handle not finding transaction by id', async () => {
    const req = { user: { userId: 'user-123' } };
    const transactionId = new Id('transaction-123');
    const transactionError = new TransactionNotFoundError(transactionId);

    jest
      .spyOn(transactionsService, 'findById')
      .mockRejectedValue(transactionError);

    await controller.findOne(
      transactionId.toString(),
      req as AuthenticatedRequest,
      res,
    );

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      error: new NotFoundException(transactionError),
      data: null,
      pagination: null,
    });
  });

  it('should handle empty transactions list in find method', async () => {
    const criteria = buildFindTransactionsCriteria();
    const req = { user: { userId: 'user-123' } };
    const transactions = [];
    const pagination = new Pagination({ total: 0, page: 1, pageSize: 25 });

    jest.spyOn(transactionsService, 'find').mockResolvedValue({
      transactions,
      pagination,
    });

    await controller.findAll(criteria, req as AuthenticatedRequest, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      success: true,
      error: null,
      data: { transactions: [] },
      pagination,
    });
  });

  it('should handle specific domain error in create method', async () => {
    const createDto: CreateTransactionDto = {
      amount: 100,
      operation: OperationType.Outcome,
      description: 'Test transaction',
      categoryId: 'category-123',
      paymentMethodId: 'payment-123',
      date: '2023-01-01' as TimeString,
    };
    const req = { user: { userId: 'user-123' } };
    const domainError = {
      code: 'TRANSACTION_NOT_FOUND',
      message: 'Transaction not found',
    };

    jest.spyOn(transactionsService, 'create').mockRejectedValue(domainError);

    await controller.create(createDto, req as AuthenticatedRequest, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      error: new InternalServerErrorException(domainError),
      data: null,
      pagination: null,
    });
  });

  it('should handle forbidden error in update method', async () => {
    const transactionId = 'transaction-123';
    const updateDto: UpdateTransactionDto = { amount: 200 };
    const req = { user: { userId: 'user-123' } };
    const domainError = {
      code: 'NOT_AUTHORIZED_FOR_TRANSACTION',
      message: 'Not authorized to access this transaction',
    };

    jest.spyOn(transactionsService, 'update').mockRejectedValue(domainError);

    await controller.update(
      transactionId,
      req as AuthenticatedRequest,
      res,
      updateDto,
    );

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      error: new ForbiddenException(domainError),
      data: null,
      pagination: null,
    });
  });

  it('should handle payment method not found error', async () => {
    const transactionId = 'transaction-123';
    const req = { user: { userId: 'user-123' } };
    const domainError = {
      code: 'PAYMENT_METHOD_NOT_FOUND',
      message: 'Payment method not found',
    };

    jest.spyOn(transactionsService, 'findById').mockRejectedValue(domainError);

    await controller.findOne(transactionId, req as AuthenticatedRequest, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      error: new NotFoundException(domainError),
      data: null,
      pagination: null,
    });
  });

  it('should handle category not authorized error in delete method', async () => {
    const transactionId = 'transaction-123';
    const req = { user: { userId: 'user-123' } };
    const domainError = {
      code: 'NOT_AUTHORIZED_FOR_CATEGORY',
      message: 'Not authorized to access this category',
    };

    jest.spyOn(transactionsService, 'delete').mockRejectedValue(domainError);

    await controller.remove(transactionId, req as AuthenticatedRequest, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      error: new ForbiddenException(domainError),
      data: null,
      pagination: null,
    });
  });
});
