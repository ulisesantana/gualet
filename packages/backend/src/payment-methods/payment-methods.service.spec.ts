import { Test } from '@nestjs/testing';
import {
  PaymentMethodsService,
  PaymentMethodToCreate,
  PaymentMethodToUpdate,
} from './payment-methods.service';
import { PaymentMethodsRepository } from './payment-methods.repository';
import { Id } from '@gualet/shared';
import { PaymentMethod } from './payment-method.model';
import { PaymentMethodNotFoundError } from './errors';

describe('PaymentMethodsService', () => {
  let service: PaymentMethodsService;
  let repository: jest.Mocked<PaymentMethodsRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PaymentMethodsService,
        {
          provide: PaymentMethodsRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get<PaymentMethodsService>(PaymentMethodsService);
    repository = moduleRef.get(PaymentMethodsRepository);
  });

  it('creates a payment method successfully', async () => {
    const userId = new Id('user-123');
    const paymentMethodToCreate: PaymentMethodToCreate = {
      name: 'New Payment Method',
      icon: '💳',
      color: '#00AAFF',
    };
    const createdPaymentMethod = new PaymentMethod({
      ...paymentMethodToCreate,
      id: new Id('pm-123'),
    });

    repository.create.mockResolvedValue(createdPaymentMethod);

    const result = await service.create(userId, paymentMethodToCreate);

    expect(result).toEqual(createdPaymentMethod);
    expect(repository.create).toHaveBeenCalledWith(
      userId,
      expect.objectContaining(paymentMethodToCreate),
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
});
