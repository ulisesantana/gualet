import { Test, TestingModule } from '@nestjs/testing';
import { DemoPaymentMethodsRepository } from '../repositories';
import { DemoService } from '../demo.service';
import { Id, PaymentMethod } from '@gualet/shared';
import {
  PaymentMethodInUseError,
  PaymentMethodNotFoundError,
} from '@src/payment-methods/errors';

describe('DemoPaymentMethodsRepository', () => {
  let repository: DemoPaymentMethodsRepository;
  let demoService: DemoService;
  const userId = new Id('demo-user-id');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DemoPaymentMethodsRepository, DemoService],
    }).compile();

    repository = module.get<DemoPaymentMethodsRepository>(
      DemoPaymentMethodsRepository,
    );
    demoService = module.get<DemoService>(DemoService);
    demoService.onModuleInit();
  });

  afterEach(() => {
    demoService.onModuleDestroy();
  });

  describe('findAll', () => {
    it('should return all demo payment methods', async () => {
      const paymentMethods = await repository.findAll(userId);
      expect(paymentMethods.length).toBeGreaterThan(0);
      expect(paymentMethods[0]).toBeInstanceOf(PaymentMethod);
    });
  });

  describe('findOne', () => {
    it('should return a payment method by id', async () => {
      const paymentMethods = await repository.findAll(userId);
      const pm = await repository.findOne(userId, paymentMethods[0].id);
      expect(pm.id.equals(paymentMethods[0].id)).toBe(true);
    });

    it('should throw PaymentMethodNotFoundError if not found', async () => {
      await expect(
        repository.findOne(userId, new Id('non-existent')),
      ).rejects.toThrow(PaymentMethodNotFoundError);
    });
  });

  describe('create', () => {
    it('should create a new payment method', async () => {
      const newPm = new PaymentMethod({
        id: new Id('new-pm'),
        name: 'Test',
        icon: '🧪',
        color: '#FF0000',
      });
      const created = await repository.create(userId, newPm);
      expect(created.name).toBe('Test');
    });
  });

  describe('update', () => {
    it('should update an existing payment method', async () => {
      const pms = await repository.findAll(userId);
      const updated = await repository.update(userId, {
        id: pms[0].id,
        name: 'Updated',
      });
      expect(updated.name).toBe('Updated');
    });

    it('should throw PaymentMethodNotFoundError if not found', async () => {
      await expect(
        repository.update(userId, {
          id: new Id('non-existent'),
          name: 'Updated',
        }),
      ).rejects.toThrow(PaymentMethodNotFoundError);
    });
  });

  describe('delete', () => {
    it('should delete a payment method not in use', async () => {
      const newPm = new PaymentMethod({
        id: new Id('to-delete'),
        name: 'Delete Me',
        icon: '🗑️',
        color: '#FF0000',
      });
      await repository.create(userId, newPm);
      await repository.delete(userId, newPm.id);
      await expect(repository.findOne(userId, newPm.id)).rejects.toThrow(
        PaymentMethodNotFoundError,
      );
    });

    it('should throw if payment method is in use', async () => {
      const pms = await repository.findAll(userId);
      await expect(repository.delete(userId, pms[0].id)).rejects.toThrow(
        PaymentMethodInUseError,
      );
    });
  });

  describe('data isolation', () => {
    it('should not persist data after service reset', async () => {
      const newPm = new PaymentMethod({
        id: new Id('temp-pm'),
        name: 'Temp',
        icon: '⏰',
        color: '#FF0000',
      });
      await repository.create(userId, newPm);
      const found = await repository.findOne(userId, newPm.id);
      expect(found).toBeDefined();

      demoService.onModuleInit();

      await expect(repository.findOne(userId, newPm.id)).rejects.toThrow(
        PaymentMethodNotFoundError,
      );
    });
  });
});
