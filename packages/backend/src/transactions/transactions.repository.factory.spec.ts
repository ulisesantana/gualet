import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsRepositoryFactory } from './transactions.repository.factory';
import { TransactionsRepository } from './transactions.repository';
import { DemoTransactionsRepository } from '@src/demo/repositories';
import { AuthenticatedRequest } from '@src/common/infrastructure';
import { REQUEST } from '@nestjs/core';

describe('TransactionsRepositoryFactory', () => {
  let factory: TransactionsRepositoryFactory;
  let dbRepository: TransactionsRepository;
  let demoRepository: DemoTransactionsRepository;

  beforeEach(async () => {
    dbRepository = {} as TransactionsRepository;
    demoRepository = {} as DemoTransactionsRepository;
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
          TransactionsRepositoryFactory,
          { provide: TransactionsRepository, useValue: dbRepository },
          { provide: DemoTransactionsRepository, useValue: demoRepository },
          { provide: REQUEST, useValue: mockRequest },
        ],
      }).compile();

      factory = await module.resolve<TransactionsRepositoryFactory>(
        TransactionsRepositoryFactory,
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
          TransactionsRepositoryFactory,
          { provide: TransactionsRepository, useValue: dbRepository },
          { provide: DemoTransactionsRepository, useValue: demoRepository },
          { provide: REQUEST, useValue: mockRequest },
        ],
      }).compile();

      factory = await module.resolve<TransactionsRepositoryFactory>(
        TransactionsRepositoryFactory,
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
          TransactionsRepositoryFactory,
          { provide: TransactionsRepository, useValue: dbRepository },
          { provide: DemoTransactionsRepository, useValue: demoRepository },
          { provide: REQUEST, useValue: mockRequest },
        ],
      }).compile();

      factory = await module.resolve<TransactionsRepositoryFactory>(
        TransactionsRepositoryFactory,
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
          TransactionsRepositoryFactory,
          { provide: TransactionsRepository, useValue: dbRepository },
          { provide: DemoTransactionsRepository, useValue: demoRepository },
          { provide: REQUEST, useValue: mockRequest },
        ],
      }).compile();

      factory = await module.resolve<TransactionsRepositoryFactory>(
        TransactionsRepositoryFactory,
      );

      const result = factory.getRepository();

      expect(result).toBe(dbRepository);
    });
  });
});
