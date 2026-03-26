import { Test } from '@nestjs/testing';
import {
  PaymentMethodsService,
  PaymentMethodToCreate,
  PaymentMethodToUpdate,
} from './payment-methods.service';
import { PaymentMethodsRepository } from './payment-methods.repository';
import { PaymentMethodsRepositoryFactory } from './payment-methods.repository.factory';
import { Id } from '@gualet/shared';
import { PaymentMethod } from './payment-method.model';
import { Logger } from '@nestjs/common';
import { PaymentMethodNotFoundError } from './errors';

describe('PaymentMethodsService', () => {
  let service: PaymentMethodsService;
  let repository: jest.Mocked<PaymentMethodsRepository>;

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        PaymentMethodsService,
        {
          provide: PaymentMethodsRepositoryFactory,
          useValue: {
            getRepository: jest.fn().mockReturnValue(mockRepository),
          },
        },
        {
          provide: PaymentMethodsRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = moduleRef.get<PaymentMethodsService>(PaymentMethodsService);
    repository = moduleRef.get(PaymentMethodsRepository);
  });

  it('creates a payment method successfully', async () => {
    const userId = new Id('user-123');
    const paymentMethodToCreate: PaymentMethodToCreate = {
      id: 'pm-123',
      name: 'New Payment Method',
      icon: '💳',
      color: '#00AAFF',
    };
    const createdPaymentMethod = new PaymentMethod({
      id: new Id(paymentMethodToCreate.id),
      name: paymentMethodToCreate.name,
      icon: paymentMethodToCreate.icon,
      color: paymentMethodToCreate.color,
    });

    repository.create.mockResolvedValue(createdPaymentMethod);

    const result = await service.create(userId, paymentMethodToCreate);

    expect(result).toEqual(createdPaymentMethod);
    expect(repository.create).toHaveBeenCalledWith(
      userId,
      expect.objectContaining({
        id: new Id(paymentMethodToCreate.id),
        name: paymentMethodToCreate.name,
      }),
    );
  });

  it('retrieves all payment methods for a user', async () => {
    const userId = new Id('user-123');
    const paymentMethods = [
      new PaymentMethod({ id: new Id('pm-1'), name: 'Method 1' }),
      new PaymentMethod({ id: new Id('pm-2'), name: 'Method 2' }),
    ];

    repository.findAll.mockResolvedValue(paymentMethods);

    const result = await service.findAll(userId);

    expect(result).toEqual(paymentMethods);
    expect(repository.findAll).toHaveBeenCalledWith(userId);
  });

  it('retrieves a payment method by id', async () => {
    const userId = new Id('user-123');
    const paymentMethodId = new Id('pm-123');
    const paymentMethod = new PaymentMethod({
      id: paymentMethodId,
      name: 'Existing Method',
    });

    repository.findOne.mockResolvedValue(paymentMethod);

    const result = await service.findOne(userId, paymentMethodId);

    expect(result).toEqual(paymentMethod);
    expect(repository.findOne).toHaveBeenCalledWith(userId, paymentMethodId);
  });

  it('throws an error when retrieving a non-existent payment method', async () => {
    const userId = new Id('user-123');
    const paymentMethodId = new Id('pm-123');

    repository.findOne.mockRejectedValue(
      new PaymentMethodNotFoundError(paymentMethodId),
    );

    await expect(service.findOne(userId, paymentMethodId)).rejects.toThrow(
      PaymentMethodNotFoundError,
    );
  });

  it('updates a payment method successfully', async () => {
    const userId = new Id('user-123');
    const paymentMethodToUpdate: PaymentMethodToUpdate = {
      id: new Id('pm-123'),
      name: 'Updated Method',
    };
    const updatedPaymentMethod = new PaymentMethod({
      ...paymentMethodToUpdate,
      id: paymentMethodToUpdate.id,
      name: paymentMethodToUpdate.name!,
      icon: '💳',
      color: '#00AAFF',
    });

    repository.update.mockResolvedValue(updatedPaymentMethod);

    const result = await service.update(userId, paymentMethodToUpdate);

    expect(result).toEqual(updatedPaymentMethod);
    expect(repository.update).toHaveBeenCalledWith(
      userId,
      paymentMethodToUpdate,
    );
  });

  it('throws an error when updating a non-existent payment method', async () => {
    const userId = new Id('user-123');
    const paymentMethodToUpdate: PaymentMethodToUpdate = {
      id: new Id('pm-123'),
      name: 'Updated Method',
    };

    repository.update.mockRejectedValue(
      new PaymentMethodNotFoundError(new Id('pm-123')),
    );

    await expect(service.update(userId, paymentMethodToUpdate)).rejects.toThrow(
      PaymentMethodNotFoundError,
    );
  });

  it('deletes a payment method successfully', async () => {
    const userId = new Id('user-123');
    const paymentMethodId = new Id('pm-123');

    repository.delete.mockResolvedValue(undefined);

    await service.delete(userId, paymentMethodId);

    expect(repository.delete).toHaveBeenCalledWith(userId, paymentMethodId);
  });

  describe('createDefaultPaymentMethods', () => {
    it('should create all default payment methods successfully', async () => {
      const userId = new Id('user-123');
      const mockPaymentMethod = new PaymentMethod({
        id: new Id('pm-123'),
        name: 'Cash',
        icon: '💵',
        color: '#00FF00',
      });

      repository.create.mockResolvedValue(mockPaymentMethod);

      const result = await service.createDefaultPaymentMethods(userId);

      expect(result.length).toBeGreaterThan(0);
      expect(repository.create).toHaveBeenCalled();
      result.forEach((pm) => {
        expect(pm).toBeInstanceOf(PaymentMethod);
      });
    });

    it('should handle failures when creating default payment methods', async () => {
      const userId = new Id('user-123');
      const mockPaymentMethod = new PaymentMethod({
        id: new Id('pm-123'),
        name: 'Cash',
        icon: '💵',
        color: '#00FF00',
      });
      const loggerErrorSpy = jest
        .spyOn(Logger.prototype, 'error')
        .mockImplementation();

      repository.create
        .mockResolvedValueOnce(mockPaymentMethod)
        .mockRejectedValueOnce(new Error('Database error'))
        .mockResolvedValue(mockPaymentMethod);

      const result = await service.createDefaultPaymentMethods(userId);

      expect(result.length).toBeGreaterThan(0);
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Failed to create default payment method:',
        expect.any(Error),
      );

      loggerErrorSpy.mockRestore();
    });
  });
});
