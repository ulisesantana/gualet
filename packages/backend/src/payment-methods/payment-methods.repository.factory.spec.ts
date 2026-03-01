import { Test, TestingModule } from '@nestjs/testing';
import { PaymentMethodsRepositoryFactory } from './payment-methods.repository.factory';
import { PaymentMethodsRepository } from './payment-methods.repository';
import { DemoPaymentMethodsRepository } from '@src/demo/repositories';
import { AuthenticatedRequest } from '@src/common/infrastructure';
import { REQUEST } from '@nestjs/core';

describe('PaymentMethodsRepositoryFactory', () => {
  let factory: PaymentMethodsRepositoryFactory;
  let dbRepository: PaymentMethodsRepository;
  let demoRepository: DemoPaymentMethodsRepository;

  beforeEach(async () => {
    dbRepository = {} as PaymentMethodsRepository;
    demoRepository = {} as DemoPaymentMethodsRepository;
  });

  describe('getRepository', () => {
    it('should return demo repository when user is demo', async () => {
      const mockRequest: Partial<AuthenticatedRequest> = {
        user: {
          userId: 'demo-user-id',
          email: 'demo@gualet.app',
          isDemo: true,
        },
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          PaymentMethodsRepositoryFactory,
          { provide: PaymentMethodsRepository, useValue: dbRepository },
          { provide: DemoPaymentMethodsRepository, useValue: demoRepository },
          { provide: REQUEST, useValue: mockRequest },
        ],
      }).compile();

      factory = await module.resolve<PaymentMethodsRepositoryFactory>(
        PaymentMethodsRepositoryFactory,
      );

      const result = factory.getRepository();

      expect(result).toBe(demoRepository);
    });

    it('should return db repository when user is not demo', async () => {
      const mockRequest: Partial<AuthenticatedRequest> = {
        user: {
          userId: 'regular-user-id',
          email: 'user@example.com',
          isDemo: false,
        },
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          PaymentMethodsRepositoryFactory,
          { provide: PaymentMethodsRepository, useValue: dbRepository },
          { provide: DemoPaymentMethodsRepository, useValue: demoRepository },
          { provide: REQUEST, useValue: mockRequest },
        ],
      }).compile();

      factory = await module.resolve<PaymentMethodsRepositoryFactory>(
        PaymentMethodsRepositoryFactory,
      );

      const result = factory.getRepository();

      expect(result).toBe(dbRepository);
    });

    it('should return db repository when isDemo is undefined', async () => {
      const mockRequest: Partial<AuthenticatedRequest> = {
        user: { userId: 'regular-user-id', email: 'user@example.com' },
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          PaymentMethodsRepositoryFactory,
          { provide: PaymentMethodsRepository, useValue: dbRepository },
          { provide: DemoPaymentMethodsRepository, useValue: demoRepository },
          { provide: REQUEST, useValue: mockRequest },
        ],
      }).compile();

      factory = await module.resolve<PaymentMethodsRepositoryFactory>(
        PaymentMethodsRepositoryFactory,
      );

      const result = factory.getRepository();

      expect(result).toBe(dbRepository);
    });

    it('should return db repository when user is null', async () => {
      const mockRequest: Partial<AuthenticatedRequest> = {
        user: null as any,
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          PaymentMethodsRepositoryFactory,
          { provide: PaymentMethodsRepository, useValue: dbRepository },
          { provide: DemoPaymentMethodsRepository, useValue: demoRepository },
          { provide: REQUEST, useValue: mockRequest },
        ],
      }).compile();

      factory = await module.resolve<PaymentMethodsRepositoryFactory>(
        PaymentMethodsRepositoryFactory,
      );

      const result = factory.getRepository();

      expect(result).toBe(dbRepository);
    });
  });
});
