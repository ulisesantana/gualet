import { Test, TestingModule } from '@nestjs/testing';
import { PaymentMethodsService } from './payment-methods.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PaymentMethodEntity } from '@src/payment-methods';
import { Repository } from 'typeorm';
import { PaymentMethod } from './payment-method.model';
import { Id } from '@src/common/domain';
import {
  NotAuthorizedForPaymentMethodError,
  PaymentMethodNotFoundError,
} from './errors';
import { buildPaymentMethodEntity } from '@test/builders';

describe('PaymentMethodsService', () => {
  let service: PaymentMethodsService;
  let repository: Repository<PaymentMethodEntity>;
  const userId = new Id('user-123');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentMethodsService,
        {
          provide: getRepositoryToken(PaymentMethodEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PaymentMethodsService>(PaymentMethodsService);
    repository = module.get<Repository<PaymentMethodEntity>>(
      getRepositoryToken(PaymentMethodEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all payment methods for a user', async () => {
    const paymentMethodEntities = [
      buildPaymentMethodEntity({ user: userId.toString() }),
      buildPaymentMethodEntity({
        user: userId.toString(),
        name: 'Credit Card',
        icon: '💳',
        color: '#FF0000',
      }),
    ];

    jest.spyOn(repository, 'find').mockResolvedValue(paymentMethodEntities);

    const result = await service.findAll(userId);

    expect(repository.find).toHaveBeenCalledWith({
      where: { user_id: userId.toString() },
    });
    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(PaymentMethod);
    expect(result[0].id).toBeInstanceOf(Id);
    expect(result[0].id.toString()).toBe(paymentMethodEntities[0].id);
    expect(result[1].name).toBe('Credit Card');
    expect(result[1].icon).toBe('💳');
    expect(result[1].color).toBe('#FF0000');
  });

  it('should return empty array when user has no payment methods', async () => {
    jest.spyOn(repository, 'find').mockResolvedValue([]);

    const result = await service.findAll(userId);

    expect(result).toEqual([]);
  });

  it('should create a new payment method', async () => {
    const newPaymentMethodData = buildPaymentMethodEntity({
      user: userId.toString(),
      name: 'Debit Card',
      icon: '💵',
      color: '#00FF00',
    });

    const savedPaymentMethod = { ...newPaymentMethodData, id: 'new-id' };
    jest.spyOn(repository, 'save').mockResolvedValue(savedPaymentMethod);

    const result = await service.create(
      new Id('user-123'),
      new PaymentMethod(newPaymentMethodData),
    );

    expect(repository.save).toHaveBeenCalled();
    expect(result).toBeInstanceOf(PaymentMethod);
    expect(result.id.toString()).toBe('new-id');
    expect(result.name).toBe('Debit Card');
    expect(result.icon).toBe('💵');
    expect(result.color).toBe('#00FF00');
  });

  it('should create a payment method handling missing optional fields', async () => {
    const paymentMethodWithoutOptionals = buildPaymentMethodEntity();
    paymentMethodWithoutOptionals.icon = undefined;
    paymentMethodWithoutOptionals.color = undefined;

    jest
      .spyOn(repository, 'save')
      .mockResolvedValue(paymentMethodWithoutOptionals);

    const result = await service.create(
      new Id(paymentMethodWithoutOptionals.user),
      new PaymentMethod(paymentMethodWithoutOptionals),
    );

    expect(result.icon).toBeNull();
    expect(result.color).toBeNull();
  });

  it('should find an existing payment method by id', async () => {
    const paymentMethod = buildPaymentMethodEntity({
      name: 'Cash',
      icon: '💰',
      color: '#00FFFF',
      user: userId.toString(),
    });
    jest.spyOn(repository, 'findOneBy').mockResolvedValue(paymentMethod);
    const paymentMethodId = new Id(paymentMethod.id);

    const result = await service.findOne(paymentMethodId, userId);

    expect(repository.findOneBy).toHaveBeenCalledWith({
      id: paymentMethodId.toString(),
    });
    expect(result).toBeInstanceOf(PaymentMethod);
    expect(result.id.equals(paymentMethod.id)).toBe(true);
    expect(result.name).toBe('Cash');
    expect(result.icon).toBe('💰');
    expect(result.color).toBe('#00FFFF');
  });

  it('should throw error when trying to find a non-existing payment method', async () => {
    jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
    const paymentMethodId = new Id();

    await expect(service.findOne(paymentMethodId, userId)).rejects.toThrow(
      PaymentMethodNotFoundError,
    );
  });

  it('should throw error when trying to find a payment method from another user', async () => {
    const paymentMethodId = new Id();
    jest
      .spyOn(repository, 'findOneBy')
      .mockResolvedValue(
        buildPaymentMethodEntity({ user: 'a-different-user-456' }),
      );

    await expect(service.findOne(paymentMethodId, userId)).rejects.toThrow(
      NotAuthorizedForPaymentMethodError,
    );
  });

  it('should save an existing payment method', async () => {
    const paymentMethodToSave = buildPaymentMethodEntity({
      name: 'Updated Payment Method',
      icon: '💵',
      color: '#0000FF',
      user: userId.toString(),
    });

    // Mock the Date functionality
    const mockDate = new Date('2023-01-01T00:00:00Z');
    const mockISOString = mockDate.toISOString();
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

    jest.spyOn(repository, 'findOne').mockResolvedValue(paymentMethodToSave);
    jest.spyOn(repository, 'save').mockResolvedValue({
      ...paymentMethodToSave,
      updatedAt: mockDate,
    });

    const result = await service.save(
      userId,
      new PaymentMethod(paymentMethodToSave),
    );

    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: paymentMethodToSave.id,
        name: 'Updated Payment Method',
        icon: '💵',
        color: '#0000FF',
        updatedAt: mockISOString,
      }),
    );

    expect(result).toBeInstanceOf(PaymentMethod);
    expect(result.id.toString()).toBe(paymentMethodToSave.id);
    expect(result.name).toBe('Updated Payment Method');
    expect(result.icon).toBe('💵');
    expect(result.color).toBe('#0000FF');

    // Restore the original Date implementation
    jest.restoreAllMocks();
  });

  it('should save a payment method handling missing optional fields', async () => {
    const paymentMethodWithoutOptionals = buildPaymentMethodEntity({
      user: userId.toString(),
    });
    paymentMethodWithoutOptionals.icon = undefined;
    paymentMethodWithoutOptionals.color = undefined;

    jest
      .spyOn(repository, 'findOne')
      .mockResolvedValue(paymentMethodWithoutOptionals);
    jest
      .spyOn(repository, 'save')
      .mockResolvedValue(paymentMethodWithoutOptionals);

    const result = await service.save(
      userId,
      new PaymentMethod(paymentMethodWithoutOptionals),
    );

    expect(result.icon).toBeNull();
    expect(result.color).toBeNull();
  });

  it('should throw error when trying to save a non-existing payment method', async () => {
    const nonExistingPaymentMethod = new PaymentMethod({
      id: new Id().toString(),
      name: 'Non-existing Payment Method',
    });

    jest.spyOn(repository, 'findOne').mockResolvedValue(null);

    await expect(
      service.save(userId, nonExistingPaymentMethod),
    ).rejects.toThrow(PaymentMethodNotFoundError);
  });

  it('should throw error when trying to save a payment method from another user', async () => {
    const paymentMethod = new PaymentMethod({
      id: new Id().toString(),
      name: 'Payment Method From Another User',
    });

    jest
      .spyOn(repository, 'findOne')
      .mockResolvedValue(
        buildPaymentMethodEntity({ user: 'a-different-user-456' }),
      );

    await expect(service.save(userId, paymentMethod)).rejects.toThrow(
      NotAuthorizedForPaymentMethodError,
    );
  });
});
