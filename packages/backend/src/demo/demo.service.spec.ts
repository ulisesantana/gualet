import { Test, TestingModule } from '@nestjs/testing';
import { DemoService } from './demo.service';

describe('DemoService', () => {
  let service: DemoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DemoService],
    }).compile();

    service = module.get<DemoService>(DemoService);
  });

  afterEach(() => {
    if (service) {
      service.onModuleDestroy();
    }
  });

  describe('initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should initialize with demo data', () => {
      service.onModuleInit();

      const categories = service.getCategories();
      const paymentMethods = service.getPaymentMethods();
      const transactions = service.getTransactions();

      expect(categories.size).toBeGreaterThan(0);
      expect(paymentMethods.size).toBeGreaterThan(0);
      expect(transactions.size).toBeGreaterThan(0);
    });
  });

  describe('getCategories', () => {
    it('should return categories map', () => {
      service.onModuleInit();
      const categories = service.getCategories();

      expect(categories).toBeInstanceOf(Map);
      expect(categories.size).toBeGreaterThan(0);
    });
  });

  describe('getPaymentMethods', () => {
    it('should return payment methods map', () => {
      service.onModuleInit();
      const paymentMethods = service.getPaymentMethods();

      expect(paymentMethods).toBeInstanceOf(Map);
      expect(paymentMethods.size).toBeGreaterThan(0);
    });
  });

  describe('getTransactions', () => {
    it('should return transactions map', () => {
      service.onModuleInit();
      const transactions = service.getTransactions();

      expect(transactions).toBeInstanceOf(Map);
      expect(transactions.size).toBeGreaterThan(0);
    });
  });

  describe('getLastResetTime', () => {
    it('should return a valid date', () => {
      service.onModuleInit();
      const lastReset = service.getLastResetTime();

      expect(lastReset).toBeInstanceOf(Date);
      expect(lastReset.getTime()).toBeLessThanOrEqual(Date.now());
    });
  });

  describe('getNextResetTime', () => {
    it('should return a future date', () => {
      service.onModuleInit();
      const nextReset = service.getNextResetTime();

      expect(nextReset).toBeInstanceOf(Date);
      expect(nextReset.getTime()).toBeGreaterThan(Date.now());
    });

    it('should be 30 minutes after last reset', () => {
      service.onModuleInit();
      const lastReset = service.getLastResetTime();
      const nextReset = service.getNextResetTime();

      const diff = nextReset.getTime() - lastReset.getTime();
      expect(diff).toBe(30 * 60 * 1000); // 30 minutes in milliseconds
    });
  });

  describe('data reset', () => {
    it('should reset data when onModuleInit is called again', () => {
      service.onModuleInit();

      // Get initial data
      const categoriesBefore = service.getCategories();
      const initialSize = categoriesBefore.size;

      // Add a new category
      const { Category, Id, OperationType } = require('@gualet/shared');
      const newCategory = new Category({
        id: new Id('temp-cat'),
        name: 'Temp',
        icon: '⏰',
        color: '#FF0000',
        type: OperationType.Outcome,
      });
      categoriesBefore.set('temp-cat', newCategory);

      expect(service.getCategories().size).toBe(initialSize + 1);

      // Reset
      service.onModuleInit();

      // Verify data was reset
      const categoriesAfter = service.getCategories();
      expect(categoriesAfter.size).toBe(initialSize);
      expect(categoriesAfter.has('temp-cat')).toBe(false);
    });
  });

  describe('lifecycle', () => {
    it('should clean up on module destroy', () => {
      service.onModuleInit();
      expect(() => service.onModuleDestroy()).not.toThrow();
    });
  });
});
