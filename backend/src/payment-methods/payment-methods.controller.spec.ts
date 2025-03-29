import { Test, TestingModule } from '@nestjs/testing';
import { PaymentMethodsController } from './payment-methods.controller';
import { PaymentMethodsService } from './payment-methods.service';
import { buildPaymentMethodEntity, getAllIds } from '@test/builders';
import { PaymentMethod } from './payment-method.model';
import {
  NotAuthorizedForPaymentMethodError,
  PaymentMethodNotFoundError,
} from './errors';
import { Id } from '@src/common/domain';
import { AuthenticatedRequest } from '@src/common/infrastructure';

describe('PaymentMethodsController', () => {
  let controller: PaymentMethodsController;
  let service: PaymentMethodsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentMethodsController],
      providers: [
        {
          provide: PaymentMethodsService,
          useValue: {
            findOne: jest.fn(),
            findAll: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PaymentMethodsController>(PaymentMethodsController);
    service = module.get<PaymentMethodsService>(PaymentMethodsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all payment methods for a user', async () => {
    const req = { user: { userId: '1' } } as unknown as AuthenticatedRequest;
    const paymentMethods = [
      buildPaymentMethodEntity({ user_id: '1' }),
      buildPaymentMethodEntity({ user_id: '1' }),
    ].map(PaymentMethodsService.mapToDomain);
    jest.spyOn(service, 'findAll').mockResolvedValue(paymentMethods);

    const result = await controller.findAll(req);

    expect(result.paymentMethods).toStrictEqual(
      paymentMethods.map((pm) => pm.toJSON()),
    );
    expect(service.findAll).toHaveBeenCalledWith(new Id('1'));
  });

  it('should create a new payment method', async () => {
    const req = { user: { userId: '1' } } as unknown as AuthenticatedRequest;
    const paymentMethod = PaymentMethodsService.mapToDomain(
      buildPaymentMethodEntity(),
    );
    const payload = {
      name: paymentMethod.name,
      icon: paymentMethod.icon as string,
      color: paymentMethod.color as string,
    };
    jest.spyOn(service, 'create').mockResolvedValue(paymentMethod);

    const result = await controller.create(payload, req);

    expect(getAllIds().includes(result.paymentMethod.id)).toBe(true);
    expect(result.paymentMethod).toStrictEqual(
      expect.objectContaining(paymentMethod.toJSON()),
    );
    expect(service.create).toHaveBeenCalledWith(
      new Id('1'),
      expect.objectContaining(payload),
    );
  });

  describe('find a payment method by id', () => {
    it('should find an existing payment method', async () => {
      const req = { user: { userId: '1' } } as unknown as AuthenticatedRequest;
      const paymentMethod = new PaymentMethod(buildPaymentMethodEntity());
      jest.spyOn(service, 'findOne').mockResolvedValue(paymentMethod);

      const result = await controller.findOne(paymentMethod.id.toString(), req);

      expect(result).toStrictEqual(paymentMethod);
      expect(service.findOne).toHaveBeenCalledWith(
        paymentMethod.id,
        new Id(req.user.userId),
      );
    });

    it('should throw NotAuthorizedForPaymentMethodError when user is not authorized', async () => {
      const req = { user: { userId: '1' } } as unknown as AuthenticatedRequest;
      const paymentMethodId = new Id().toString();
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(
          new NotAuthorizedForPaymentMethodError(new Id(paymentMethodId)),
        );

      await expect(controller.findOne(paymentMethodId, req)).rejects.toThrow(
        NotAuthorizedForPaymentMethodError,
      );
    });

    it('should throw PaymentMethodNotFoundError when payment method does not exist', async () => {
      const req = { user: { userId: '1' } } as unknown as AuthenticatedRequest;
      const paymentMethodId = new Id().toString();
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(
          new PaymentMethodNotFoundError(new Id(paymentMethodId)),
        );

      await expect(controller.findOne(paymentMethodId, req)).rejects.toThrow(
        PaymentMethodNotFoundError,
      );
    });
  });

  describe('save a payment method', () => {
    it('should save an existing payment method', async () => {
      const paymentMethod = new PaymentMethod(buildPaymentMethodEntity());
      jest.spyOn(service, 'save').mockResolvedValue(paymentMethod);

      const result = await controller.save(paymentMethod.id.toString(), {
        name: paymentMethod.name,
        icon: paymentMethod.icon as string,
        color: paymentMethod.color as string,
      });

      expect(result).toStrictEqual(paymentMethod);
      expect(service.save).toHaveBeenCalledWith(
        paymentMethod.id,
        paymentMethod,
      );
    });

    it('should save a payment method with missing icon and color on payload', async () => {
      const paymentMethod = new PaymentMethod(buildPaymentMethodEntity());
      jest.spyOn(service, 'save').mockResolvedValue(paymentMethod);

      const result = await controller.save(paymentMethod.id.toString(), {
        name: paymentMethod.name,
      });

      expect(result).toStrictEqual(paymentMethod);
      expect(service.save).toHaveBeenCalledWith(
        paymentMethod.id,
        expect.objectContaining({
          name: paymentMethod.name,
        }),
      );
    });

    it('should throw NotAuthorizedForPaymentMethodError when user is not authorized', async () => {
      const paymentMethodId = new Id().toString();
      jest
        .spyOn(service, 'save')
        .mockRejectedValue(
          new NotAuthorizedForPaymentMethodError(new Id(paymentMethodId)),
        );

      await expect(
        controller.save(paymentMethodId, {
          name: 'Test Payment Method',
        }),
      ).rejects.toThrow(NotAuthorizedForPaymentMethodError);
    });

    it('should throw PaymentMethodNotFoundError when payment method does not exist', async () => {
      const paymentMethodId = new Id().toString();
      jest
        .spyOn(service, 'save')
        .mockRejectedValue(
          new PaymentMethodNotFoundError(new Id(paymentMethodId)),
        );

      await expect(
        controller.save(paymentMethodId, {
          name: 'Test Payment Method',
        }),
      ).rejects.toThrow(PaymentMethodNotFoundError);
    });
  });
});
