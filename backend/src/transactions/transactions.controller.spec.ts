import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import {
  CreateTransactionDto,
  DeleteTransactionResponseDto,
  TransactionResponseDto,
  TransactionsResponseDto,
  UpdateTransactionDto,
} from './dto';
import { Id, OperationType } from '@src/common/domain';
import { buildFindTransactionsCriteria } from '@test/builders/dto/find-transactions-criteria.dto.builder';
import { buildTransaction } from '@test/builders/entities/transaction.entity.builder';
import { TimeString } from '@src/common/types';
import { AuthenticatedRequest, Pagination } from '@src/common/infrastructure';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let transactionsService: TransactionsService;
  let errorHasBeenThrown = false;

  beforeEach(async () => {
    errorHasBeenThrown = false;
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

      const result = await controller.create(
        createDto,
        req as AuthenticatedRequest,
      );

      expect(transactionsService.create).toHaveBeenCalledWith(
        expect.any(Id),
        createDto,
      );
      expect(result).toBeInstanceOf(TransactionResponseDto);
      expect(result).toEqual(new TransactionResponseDto(transaction));
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

      try {
        await controller.create(createDto, req as AuthenticatedRequest);
      } catch (error) {
        errorHasBeenThrown = true;
        expect(error?.response.success).toBe(false);
        expect(error?.response.data).toBeNull();
        expect(error?.response.error).toEqual(expectedError);
        expect(error?.response.pagination).toBeNull();
      } finally {
        expect(errorHasBeenThrown).toBe(true);
      }
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

      const result = await controller.findAll(
        criteria,
        req as AuthenticatedRequest,
      );

      expect(transactionsService.find).toHaveBeenCalledWith(
        expect.any(Id),
        criteria,
      );
      expect(result).toBeInstanceOf(TransactionsResponseDto);
      expect(result.data).toEqual({
        transactions: transactions.map((t) => t.toJSON()),
      });
      expect(result.error).toBeNull();
      expect(result.pagination).toEqual(pagination);
    });

    it('should throw InternalServerErrorException when service fails', async () => {
      const criteria = buildFindTransactionsCriteria();
      const req = { user: { userId: 'user-123' } };
      const expectedError = new Error('Database error');

      jest.spyOn(transactionsService, 'find').mockRejectedValue(expectedError);

      try {
        await controller.findAll(criteria, req as AuthenticatedRequest);
      } catch (error) {
        errorHasBeenThrown = true;
        expect(error?.response.success).toBe(false);
        expect(error?.response.data).toBeNull();
        expect(error?.response.error).toEqual(expectedError);
        expect(error?.response.pagination).toBeNull();
      } finally {
        expect(errorHasBeenThrown).toBe(true);
      }
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

      const result = await controller.findOne(
        transactionId,
        req as AuthenticatedRequest,
      );

      expect(transactionsService.findById).toHaveBeenCalledWith(
        new Id(req.user.userId),
        new Id(transactionId),
      );
      expect(result).toBeInstanceOf(TransactionResponseDto);
      expect(result.success).toBe(true);
      expect(result.data).toEqual({ transaction: transaction.toJSON() });
      expect(result.error).toBeNull();
      expect(result.pagination).toBeNull();
    });

    it('should throw InternalServerErrorException when service fails', async () => {
      const transactionId = 'transaction-123';
      const req = { user: { userId: 'user-123' } };
      const expectedError = new Error('Transaction not found');

      jest
        .spyOn(transactionsService, 'findById')
        .mockRejectedValue(expectedError);

      try {
        await controller.findOne(transactionId, req as AuthenticatedRequest);
      } catch (error) {
        errorHasBeenThrown = true;
        expect(error?.response.success).toBe(false);
        expect(error?.response.data).toBeNull();
        expect(error?.response.error).toEqual(expectedError);
        expect(error?.response.pagination).toBeNull();
      } finally {
        expect(errorHasBeenThrown).toBe(true);
      }
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

      const result = await controller.update(
        transactionId,
        req as AuthenticatedRequest,
        updateDto,
      );

      expect(transactionsService.update).toHaveBeenCalledWith(
        expect.any(Id),
        expect.objectContaining({
          ...updateDto,
          id: expect.any(Id),
        }),
      );
      expect(result).toBeInstanceOf(TransactionResponseDto);
      expect(result.success).toBe(true);
      expect(result.data).toEqual({ transaction: transaction.toJSON() });
      expect(result.error).toBeNull();
      expect(result.pagination).toBeNull();
    });

    it('should throw InternalServerErrorException when service fails', async () => {
      const transactionId = 'transaction-123';
      const updateDto: UpdateTransactionDto = { amount: 200 };
      const req = { user: { userId: 'user-123' } };
      const expectedError = new Error('Transaction not found');

      jest
        .spyOn(transactionsService, 'update')
        .mockRejectedValue(expectedError);

      try {
        await controller.update(
          transactionId,
          req as AuthenticatedRequest,
          updateDto,
        );
      } catch (error) {
        errorHasBeenThrown = true;
        expect(error?.response.success).toBe(false);
        expect(error?.response.data).toBeNull();
        expect(error?.response.error).toEqual(expectedError);
        expect(error?.response.pagination).toBeNull();
      } finally {
        expect(errorHasBeenThrown).toBe(true);
      }
    });
  });

  describe('remove', () => {
    it('should delete a transaction successfully', async () => {
      const transactionId = 'transaction-123';
      const req = { user: { userId: 'user-123' } };

      jest.spyOn(transactionsService, 'delete').mockResolvedValue(undefined);

      const result = await controller.remove(
        transactionId,
        req as AuthenticatedRequest,
      );

      expect(transactionsService.delete).toHaveBeenCalledWith(
        new Id(req.user.userId),
        new Id(transactionId),
      );
      expect(result).toBeInstanceOf(DeleteTransactionResponseDto);
      expect(result.success).toBe(true);
      expect(result.data).toBeNull();
      expect(result.error).toBeNull();
      expect(result.pagination).toBeNull();
    });

    it('should throw InternalServerErrorException when service fails', async () => {
      const transactionId = 'transaction-123';
      const req = { user: { userId: 'user-123' } };
      const expectedError = new Error('Transaction not found');

      jest
        .spyOn(transactionsService, 'delete')
        .mockRejectedValue(expectedError);

      try {
        await controller.remove(transactionId, req as AuthenticatedRequest);
      } catch (error) {
        errorHasBeenThrown = true;
        expect(error?.response.success).toBe(false);
        expect(error?.response.data).toBeNull();
        expect(error?.response.error).toEqual(expectedError);
        expect(error?.response.pagination).toBeNull();
      } finally {
        expect(errorHasBeenThrown).toBe(true);
      }
    });
  });
});
