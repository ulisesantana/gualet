import { Test, TestingModule } from '@nestjs/testing';
import { PaymentMethodsController } from './payment-methods.controller';
import { PaymentMethodsService } from './payment-methods.service';
import {
  buildPaymentMethodEntity,
  buildUserEntity,
  getAllIds,
} from '@test/builders';
import { PaymentMethod } from './payment-method.model';
import {
  NotAuthorizedForPaymentMethodError,
  PaymentMethodNotFoundError,
} from './errors';
import { Id } from '@src/common/domain';
import { AuthenticatedRequest } from '@src/common/infrastructure';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { PaymentMethodsRepository } from '@src/payment-methods/payment-methods.repository';

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
            update: jest.fn(),
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
      buildPaymentMethodEntity({ user: buildUserEntity({ id: '1' }) }),
      buildPaymentMethodEntity({ user: buildUserEntity({ id: '1' }) }),
    ].map(PaymentMethodsRepository.mapToDomain);
    jest.spyOn(service, 'findAll').mockResolvedValue(paymentMethods);

    const result = await controller.findAll(req);

    expect(result).toEqual({
      success: true,
      error: null,
      data: {
        paymentMethods: paymentMethods.map((pm) => pm.toJSON()),
      },
      pagination: null,
    });
    expect(service.findAll).toHaveBeenCalledWith(new Id('1'));
  });

  it('should create a new payment method', async () => {
    const req = { user: { userId: '1' } } as unknown as AuthenticatedRequest;
    const paymentMethod = PaymentMethodsRepository.mapToDomain(
      buildPaymentMethodEntity(),
    );
    const payload = {
      name: paymentMethod.name,
      icon: paymentMethod.icon as string,
      color: paymentMethod.color as string,
    };
    jest.spyOn(service, 'create').mockResolvedValue(paymentMethod);

    const result = await controller.create(payload, req);

    expect(result.success).toBe(true);
    expect(result.error).toBe(null);
    expect(result.data).toStrictEqual({
      paymentMethod: {
        ...paymentMethod.toJSON(),
        id: expect.any(String),
      },
    });
    expect(getAllIds().includes(result.data!.paymentMethod.id)).toBe(true);
    expect(service.create).toHaveBeenCalledWith(
      new Id('1'),
      expect.objectContaining(payload),
    );
  });

  describe('find a payment method by id', () => {
    let throwError = true;

    beforeEach(() => {
      throwError = true;
    });
    it('should find an existing payment method', async () => {
      const req = { user: { userId: '1' } } as unknown as AuthenticatedRequest;
      const paymentMethod = new PaymentMethod(buildPaymentMethodEntity());
      jest.spyOn(service, 'findOne').mockResolvedValue(paymentMethod);

      const result = await controller.findOne(paymentMethod.id.toString(), req);

      expect(result).toEqual({
        success: true,
        error: null,
        data: {
          paymentMethod: paymentMethod.toJSON(),
        },
        pagination: null,
      });
      expect(service.findOne).toHaveBeenCalledWith(
        new Id(req.user.userId),
        paymentMethod.id,
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

      try {
        await controller.findOne(paymentMethodId, req);
        throwError = false;
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.response).toEqual({
          statusCode: 403,
          message: `Not authorized for payment method with id "${paymentMethodId}".`,
          error: 'Forbidden',
        });
      } finally {
        expect(throwError).toEqual(true);
      }
    });

    it('should throw PaymentMethodNotFoundError when payment method does not exist', async () => {
      const req = { user: { userId: '1' } } as unknown as AuthenticatedRequest;
      const paymentMethodId = new Id().toString();
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(
          new PaymentMethodNotFoundError(new Id(paymentMethodId)),
        );

      try {
        await controller.findOne(paymentMethodId, req);
        throwError = false;
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.response).toEqual({
          statusCode: 404,
          message: `Payment method with id "${paymentMethodId}" not found.`,
          error: 'Not Found',
        });
      } finally {
        expect(throwError).toEqual(true);
      }
    });
  });

  describe('update a payment method', () => {
    let throwError = true;
    const req = { user: { userId: '1' } } as unknown as AuthenticatedRequest;

    beforeEach(() => {
      throwError = true;
    });

    it('should update an existing payment method', async () => {
      const paymentMethod = new PaymentMethod(buildPaymentMethodEntity());
      jest.spyOn(service, 'update').mockResolvedValue(paymentMethod);

      const result = await controller.update(paymentMethod.id.toString(), req, {
        name: paymentMethod.name,
        icon: paymentMethod.icon as string,
        color: paymentMethod.color as string,
      });

      expect(result).toEqual({
        success: true,
        error: null,
        data: {
          paymentMethod: paymentMethod.toJSON(),
        },
        pagination: null,
      });
      expect(service.update).toHaveBeenCalledWith(
        new Id(req.user.userId),
        paymentMethod,
      );
    });

    it('should update a payment method with missing icon and color on payload', async () => {
      const paymentMethod = new PaymentMethod(buildPaymentMethodEntity());
      jest.spyOn(service, 'update').mockResolvedValue(paymentMethod);

      const result = await controller.update(paymentMethod.id.toString(), req, {
        name: paymentMethod.name,
      });

      expect(result).toEqual({
        success: true,
        error: null,
        data: {
          paymentMethod: paymentMethod.toJSON(),
        },
        pagination: null,
      });
      expect(service.update).toHaveBeenCalledWith(
        new Id(req.user.userId),
        expect.objectContaining({
          name: paymentMethod.name,
        }),
      );
    });

    it('should throw NotAuthorizedForPaymentMethodError when user is not authorized', async () => {
      const paymentMethodId = new Id().toString();
      jest
        .spyOn(service, 'update')
        .mockRejectedValue(
          new NotAuthorizedForPaymentMethodError(new Id(paymentMethodId)),
        );

      try {
        await controller.update(paymentMethodId, req, {
          name: 'Test Payment Method',
        });
        throwError = false;
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.response).toEqual({
          statusCode: 403,
          message: `Not authorized for payment method with id "${paymentMethodId}".`,
          error: 'Forbidden',
        });
      } finally {
        expect(throwError).toEqual(true);
      }
    });

    it('should throw PaymentMethodNotFoundError when payment method does not exist', async () => {
      const paymentMethodId = new Id().toString();
      jest
        .spyOn(service, 'update')
        .mockRejectedValue(
          new PaymentMethodNotFoundError(new Id(paymentMethodId)),
        );

      try {
        await controller.update(paymentMethodId, req, {
          name: 'Test Payment Method',
        });
        throwError = false;
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.response).toEqual({
          statusCode: 404,
          message: `Payment method with id "${paymentMethodId}" not found.`,
          error: 'Not Found',
        });
      } finally {
        expect(throwError).toEqual(true);
      }
    });
  });
});
