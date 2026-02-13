import { Test } from '@nestjs/testing';
import { UserPreferencesService } from './user-preferences.service';
import { UserPreferencesRepository } from './user-preferences.repository';
import { PaymentMethodsService } from '@src/payment-methods/payment-methods.service';
import { Id } from '@gualet/shared';
import { UserPreferences } from './user-preferences.model';
import { buildPaymentMethod } from '@test/builders';

describe('UserPreferencesService', () => {
  let service: UserPreferencesService;
  let repository: jest.Mocked<UserPreferencesRepository>;
  let paymentMethodsService: jest.Mocked<PaymentMethodsService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserPreferencesService,
        {
          provide: UserPreferencesRepository,
          useValue: {
            findByUserId: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: PaymentMethodsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get<UserPreferencesService>(UserPreferencesService);
    repository = moduleRef.get(UserPreferencesRepository);
    paymentMethodsService = moduleRef.get(PaymentMethodsService);
  });

  describe('find', () => {
    it('should return existing user preferences', async () => {
      const userId = new Id('user-123');
      const paymentMethod = buildPaymentMethod();
      const preferences = new UserPreferences(userId, paymentMethod);

      repository.findByUserId.mockResolvedValue(preferences);

      const result = await service.find(userId);

      expect(result).toEqual(preferences);
      expect(repository.findByUserId).toHaveBeenCalledWith(userId);
    });

    it('should return default preferences when none exist', async () => {
      const userId = new Id('user-123');
      const paymentMethod = buildPaymentMethod();

      repository.findByUserId.mockResolvedValue(null);
      paymentMethodsService.findAll.mockResolvedValue([paymentMethod]);

      const result = await service.find(userId);

      expect(result).not.toBeNull();
      expect(result?.userId).toEqual(userId);
      expect(result?.defaultPaymentMethod).toEqual(paymentMethod);
      expect(repository.findByUserId).toHaveBeenCalledWith(userId);
      expect(paymentMethodsService.findAll).toHaveBeenCalledWith(userId);
    });

    it('should return null when no payment methods are available', async () => {
      const userId = new Id('user-123');

      repository.findByUserId.mockResolvedValue(null);
      paymentMethodsService.findAll.mockResolvedValue([]);

      const result = await service.find(userId);

      expect(result).toBeNull();
      expect(repository.findByUserId).toHaveBeenCalledWith(userId);
      expect(paymentMethodsService.findAll).toHaveBeenCalledWith(userId);
    });
  });

  describe('save', () => {
    it('should save user preferences successfully', async () => {
      const userId = new Id('user-123');
      const paymentMethodId = new Id('pm-123');
      const paymentMethod = buildPaymentMethod({ id: paymentMethodId.value });
      const preferences = new UserPreferences(userId, paymentMethod);

      paymentMethodsService.findOne.mockResolvedValue(paymentMethod);
      repository.save.mockResolvedValue(preferences);

      const result = await service.save(userId, paymentMethodId);

      expect(result).toEqual(preferences);
      expect(paymentMethodsService.findOne).toHaveBeenCalledWith(
        userId,
        paymentMethodId,
      );
      expect(repository.save).toHaveBeenCalledWith(
        userId,
        paymentMethodId,
        undefined,
      );
    });

    it('should throw error if payment method does not exist', async () => {
      const userId = new Id('user-123');
      const paymentMethodId = new Id('pm-123');

      paymentMethodsService.findOne.mockRejectedValue(
        new Error('Payment method not found'),
      );

      await expect(service.save(userId, paymentMethodId)).rejects.toThrow(
        'Payment method not found',
      );

      expect(paymentMethodsService.findOne).toHaveBeenCalledWith(
        userId,
        paymentMethodId,
      );
      expect(repository.save).not.toHaveBeenCalled();
    });
  });
});
