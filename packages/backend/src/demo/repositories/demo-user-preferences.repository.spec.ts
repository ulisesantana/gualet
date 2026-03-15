import { Test, TestingModule } from '@nestjs/testing';
import { DemoUserPreferencesRepository } from './demo-user-preferences.repository';
import { DemoPaymentMethodsRepository } from './demo-payment-methods.repository';
import { Id, PaymentMethod } from '@gualet/shared';

describe('DemoUserPreferencesRepository', () => {
  let repository: DemoUserPreferencesRepository;
  let demoPaymentMethodsRepository: jest.Mocked<DemoPaymentMethodsRepository>;

  const mockPaymentMethod = new PaymentMethod({
    id: new Id('demo-pm-1'),
    name: 'Debit Card',
    icon: '💳',
    color: '#6C5CE7',
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DemoUserPreferencesRepository,
        {
          provide: DemoPaymentMethodsRepository,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockPaymentMethod]),
            findOne: jest.fn().mockResolvedValue(mockPaymentMethod),
          },
        },
      ],
    }).compile();

    demoPaymentMethodsRepository = module.get(DemoPaymentMethodsRepository);
    repository = module.get<DemoUserPreferencesRepository>(
      DemoUserPreferencesRepository,
    );
  });

  describe('findByUserId', () => {
    it('should return default preferences with first payment method', async () => {
      const userId = new Id('demo-user-id');

      const preferences = await repository.findByUserId(userId);

      expect(preferences).toBeTruthy();
      expect(preferences!.userId).toEqual(userId);
      expect(preferences!.defaultPaymentMethod).toBeInstanceOf(PaymentMethod);
      expect(preferences!.language).toBe('en');
    });

    it('should return preferences with demo payment method', async () => {
      const userId = new Id('demo-user-id');

      const preferences = await repository.findByUserId(userId);
      const paymentMethods = await demoPaymentMethodsRepository.findAll(userId);

      expect(preferences!.defaultPaymentMethod.id).toEqual(
        paymentMethods[0].id,
      );
    });
  });

  describe('save', () => {
    it('should save preferences and return them', async () => {
      const userId = new Id('demo-user-id');
      const paymentMethods = await demoPaymentMethodsRepository.findAll(userId);
      const paymentMethodId = paymentMethods[0].id;

      const preferences = await repository.save(userId, paymentMethodId, 'es');

      expect(preferences).toBeTruthy();
      expect(preferences.userId).toEqual(userId);
      expect(preferences.defaultPaymentMethod.id).toEqual(paymentMethodId);
      expect(preferences.language).toBe('es');
    });

    it('should use default language if not provided', async () => {
      const userId = new Id('demo-user-id');
      const paymentMethods = await demoPaymentMethodsRepository.findAll(userId);
      const paymentMethodId = paymentMethods[0].id;

      const preferences = await repository.save(userId, paymentMethodId);

      expect(preferences.language).toBe('en');
    });

    it('should throw error if payment method not found', async () => {
      const userId = new Id('demo-user-id');
      const nonExistentId = new Id('non-existent');

      // Mock findAll to return empty array for this test
      demoPaymentMethodsRepository.findAll.mockResolvedValueOnce([]);

      await expect(repository.save(userId, nonExistentId)).rejects.toThrow(
        'Payment method not found',
      );
    });

    it('should work with all demo payment methods', async () => {
      const userId = new Id('demo-user-id');

      // Mock multiple payment methods
      const mockPaymentMethods = [
        mockPaymentMethod,
        new PaymentMethod({
          id: new Id('demo-pm-2'),
          name: 'Cash',
          icon: '💵',
          color: '#00B894',
        }),
      ];

      demoPaymentMethodsRepository.findAll.mockResolvedValue(
        mockPaymentMethods,
      );

      for (const pm of mockPaymentMethods) {
        const preferences = await repository.save(userId, pm.id, 'es');
        expect(preferences.defaultPaymentMethod.id).toEqual(pm.id);
      }
    });
  });
});
