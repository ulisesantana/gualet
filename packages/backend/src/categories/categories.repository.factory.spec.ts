import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesRepositoryFactory } from './categories.repository.factory';
import { CategoriesRepository } from './categories.repository';
import { DemoCategoriesRepository } from '@src/demo/repositories';
import { AuthenticatedRequest } from '@src/common/infrastructure';
import { REQUEST } from '@nestjs/core';

describe('CategoriesRepositoryFactory', () => {
  let factory: CategoriesRepositoryFactory;
  let dbRepository: CategoriesRepository;
  let demoRepository: DemoCategoriesRepository;

  beforeEach(async () => {
    dbRepository = {} as CategoriesRepository;
    demoRepository = {} as DemoCategoriesRepository;
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
          CategoriesRepositoryFactory,
          { provide: CategoriesRepository, useValue: dbRepository },
          { provide: DemoCategoriesRepository, useValue: demoRepository },
          { provide: REQUEST, useValue: mockRequest },
        ],
      }).compile();

      factory = await module.resolve<CategoriesRepositoryFactory>(
        CategoriesRepositoryFactory,
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
          CategoriesRepositoryFactory,
          { provide: CategoriesRepository, useValue: dbRepository },
          { provide: DemoCategoriesRepository, useValue: demoRepository },
          { provide: REQUEST, useValue: mockRequest },
        ],
      }).compile();

      factory = await module.resolve<CategoriesRepositoryFactory>(
        CategoriesRepositoryFactory,
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
          CategoriesRepositoryFactory,
          { provide: CategoriesRepository, useValue: dbRepository },
          { provide: DemoCategoriesRepository, useValue: demoRepository },
          { provide: REQUEST, useValue: mockRequest },
        ],
      }).compile();

      factory = await module.resolve<CategoriesRepositoryFactory>(
        CategoriesRepositoryFactory,
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
          CategoriesRepositoryFactory,
          { provide: CategoriesRepository, useValue: dbRepository },
          { provide: DemoCategoriesRepository, useValue: demoRepository },
          { provide: REQUEST, useValue: mockRequest },
        ],
      }).compile();

      factory = await module.resolve<CategoriesRepositoryFactory>(
        CategoriesRepositoryFactory,
      );

      const result = factory.getRepository();

      expect(result).toBe(dbRepository);
    });
  });
});
