import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentMethodsRepository } from './payment-methods.repository';
import { buildPaymentMethodEntity, buildUserEntity } from '@test/builders';
import { Id } from '@gualet/shared';
import {
  NotAuthorizedForPaymentMethodError,
  PaymentMethodNotFoundError,
} from './errors';
import { PaymentMethod } from './payment-method.model';
import { PaymentMethodEntity, TransactionEntity } from '@src/db';

describe('PaymentMethodsRepository', () => {
  let repository: PaymentMethodsRepository;
  let mockRepository: jest.Mocked<Repository<PaymentMethodEntity>>;
  let mockTransactionRepository: jest.Mocked<Repository<TransactionEntity>>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PaymentMethodsRepository,
        {
          provide: getRepositoryToken(PaymentMethodEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(TransactionEntity),
          useValue: {
            count: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = moduleRef.get<PaymentMethodsRepository>(
      PaymentMethodsRepository,
    );
    mockRepository = moduleRef.get(getRepositoryToken(PaymentMethodEntity));
    mockTransactionRepository = moduleRef.get(
      getRepositoryToken(TransactionEntity),
    );
  });

  it('should create a payment method', async () => {
    const userId = new Id('user-123');
    const paymentMethod = new PaymentMethod({
      id: new Id(),
      name: 'Test Payment Method',
      icon: '💳',
      color: '#00AAFF',
    });
    const mockEntity = buildPaymentMethodEntity({
      user: buildUserEntity({ id: userId.toString() }),
    });

    mockRepository.create.mockReturnValue(mockEntity);
    mockRepository.save.mockResolvedValue(mockEntity);

    const result = await repository.create(userId, paymentMethod);

    expect(mockRepository.create).toHaveBeenCalledWith({
      ...paymentMethod.toJSON(),
      user: {
        id: userId.toString(),
      },
      icon: paymentMethod.icon,
      color: paymentMethod.color,
    });
    expect(result).toEqual(PaymentMethodsRepository.mapToDomain(mockEntity));
  });

  it('should find all payment methods for a user', async () => {
    const userId = new Id('user-123');
    const mockEntities = [
      buildPaymentMethodEntity({
        user: buildUserEntity({ id: userId.toString() }),
      }),
    ];

    mockRepository.find.mockResolvedValue(mockEntities);

    const result = await repository.findAll(userId);

    expect(mockRepository.find).toHaveBeenCalledWith({
      where: { user: { id: userId.toString() } },
    });
    expect(result).toEqual(
      mockEntities.map(PaymentMethodsRepository.mapToDomain),
    );
  });

  it('should find a payment method by id', async () => {
    const userId = new Id('user-123');
    const paymentMethodId = new Id('pm-123');
    const mockEntity = buildPaymentMethodEntity({
      id: paymentMethodId.toString(),
      user: buildUserEntity({ id: userId.toString() }),
    });

    mockRepository.findOneBy.mockResolvedValue(mockEntity);

    const result = await repository.findOne(userId, paymentMethodId);

    expect(mockRepository.findOneBy).toHaveBeenCalledWith({
      id: paymentMethodId.toString(),
    });
    expect(result).toEqual(PaymentMethodsRepository.mapToDomain(mockEntity));
  });

  it('should throw an error when finding a non-existent payment method', async () => {
    const userId = new Id('user-123');
    const paymentMethodId = new Id('pm-123');

    mockRepository.findOneBy.mockResolvedValue(null);

    await expect(repository.findOne(userId, paymentMethodId)).rejects.toThrow(
      PaymentMethodNotFoundError,
    );
  });

  it('should throw an error when user is not authorized for a payment method', async () => {
    const userId = new Id('user-123');
    const paymentMethodId = new Id('pm-123');
    const mockEntity = buildPaymentMethodEntity({
      id: paymentMethodId.toString(),
      user: buildUserEntity({ id: 'other-user' }),
    });

    mockRepository.findOneBy.mockResolvedValue(mockEntity);

    await expect(repository.findOne(userId, paymentMethodId)).rejects.toThrow(
      NotAuthorizedForPaymentMethodError,
    );
  });

  it('should update a payment method', async () => {
    const userId = new Id('user-123');
    const id = 'pm-123';
    const paymentMethodToUpdate = {
      id: new Id(id),
      name: 'Updated Payment Method',
      color: 'red',
      icon: undefined,
    };
    const existingEntity = buildPaymentMethodEntity({
      id,
      user: buildUserEntity({ id: userId.toString() }),
      icon: '💳',
      color: 'blue',
    });
    const updatedEntity = {
      ...existingEntity,
      name: paymentMethodToUpdate.name,
      color: paymentMethodToUpdate.color,
      icon: '💳', // Keeps existing value when undefined is passed
    };

    mockRepository.findOne.mockResolvedValue(existingEntity);
    mockRepository.save.mockResolvedValue(updatedEntity);

    const result = await repository.update(userId, paymentMethodToUpdate);

    expect(mockRepository.save).toHaveBeenCalled();
    expect(result).toEqual(PaymentMethodsRepository.mapToDomain(updatedEntity));
  });

  it('should throw an error when updating a non-existent payment method', async () => {
    const userId = new Id('user-123');
    const paymentMethodToUpdate = {
      id: new Id('pm-123'),
      name: 'Updated Name',
    };

    mockRepository.findOne.mockResolvedValue(null);

    await expect(
      repository.update(userId, paymentMethodToUpdate),
    ).rejects.toThrow(PaymentMethodNotFoundError);
  });

  it('should throw an error when user is not authorized to update a payment method', async () => {
    const userId = new Id('user-123');
    const paymentMethodToUpdate = {
      id: new Id('pm-123'),
      name: 'Updated Name',
    };
    const existingEntity = buildPaymentMethodEntity({
      id: paymentMethodToUpdate.id.toString(),
      user: buildUserEntity({ id: 'other-user' }),
    });

    mockRepository.findOne.mockResolvedValue(existingEntity);

    await expect(
      repository.update(userId, paymentMethodToUpdate),
    ).rejects.toThrow(NotAuthorizedForPaymentMethodError);
  });

  it('should handle explicit null values for icon and color to clear them', async () => {
    const userId = new Id('user-123');
    const id = 'pm-123';
    const paymentMethodToUpdate = {
      id: new Id(id),
      name: 'Updated Name',
      icon: null,
      color: null,
    };
    const existingEntity = buildPaymentMethodEntity({
      id,
      user: buildUserEntity({ id: userId.toString() }),
      icon: '💳',
      color: 'blue',
    });
    const updatedEntity = {
      ...existingEntity,
      name: paymentMethodToUpdate.name,
      icon: undefined,
      color: undefined,
    };

    mockRepository.findOne.mockResolvedValue(existingEntity);
    mockRepository.save.mockResolvedValue(updatedEntity);

    const result = await repository.update(userId, paymentMethodToUpdate);

    expect(mockRepository.save).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  describe('delete', () => {
    it('should delete a payment method when it exists, user is authorized, and not in use', async () => {
      const userId = new Id('user-123');
      const pmId = new Id('pm-123');
      const existingEntity = buildPaymentMethodEntity({
        id: pmId.toString(),
        user: buildUserEntity({ id: userId.toString() }),
      });

      mockRepository.findOne.mockResolvedValue(existingEntity);
      mockTransactionRepository.count.mockResolvedValue(0);
      mockRepository.delete.mockResolvedValue({
        raw: [],
        affected: 1,
      });

      await repository.delete(userId, pmId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: pmId.toString() },
      });
      expect(mockTransactionRepository.count).toHaveBeenCalledWith({
        where: { payment_method: { id: pmId.toString() } },
      });
      expect(mockRepository.delete).toHaveBeenCalledWith({
        id: pmId.toString(),
      });
    });

    it('should throw PaymentMethodNotFoundError when payment method does not exist', async () => {
      const userId = new Id('user-123');
      const pmId = new Id('pm-123');

      mockRepository.findOne.mockResolvedValue(null);

      await expect(repository.delete(userId, pmId)).rejects.toThrow(
        PaymentMethodNotFoundError,
      );
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw NotAuthorizedForPaymentMethodError when user is not authorized', async () => {
      const userId = new Id('user-123');
      const pmId = new Id('pm-123');
      const existingEntity = buildPaymentMethodEntity({
        id: pmId.toString(),
        user: buildUserEntity({ id: 'other-user' }),
      });

      mockRepository.findOne.mockResolvedValue(existingEntity);

      await expect(repository.delete(userId, pmId)).rejects.toThrow(
        NotAuthorizedForPaymentMethodError,
      );
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw PaymentMethodInUseError when payment method is used by transactions', async () => {
      const userId = new Id('user-123');
      const pmId = new Id('pm-123');
      const existingEntity = buildPaymentMethodEntity({
        id: pmId.toString(),
        user: buildUserEntity({ id: userId.toString() }),
      });

      mockRepository.findOne.mockResolvedValue(existingEntity);
      mockTransactionRepository.count.mockResolvedValue(3);

      await expect(repository.delete(userId, pmId)).rejects.toThrow(
        'is in use and cannot be deleted',
      );
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });
  });
});
