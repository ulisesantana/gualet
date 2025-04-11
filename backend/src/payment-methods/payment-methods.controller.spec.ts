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
import { Response } from 'express';
import Mocked = jest.Mocked;

describe('PaymentMethodsController', () => {
  let controller: PaymentMethodsController;
  let service: PaymentMethodsService;
  let res: Mocked<Response>;

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
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn((x: unknown) => x),
    } as unknown as Mocked<Response>;
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
    beforeEach(() => {});
    it('should find an existing payment method', async () => {
      const req = { user: { userId: '1' } } as unknown as AuthenticatedRequest;
      const paymentMethod = new PaymentMethod(buildPaymentMethodEntity());
      jest.spyOn(service, 'findOne').mockResolvedValue(paymentMethod);

      await controller.findOne(paymentMethod.id.toString(), req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
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
      const error = new NotAuthorizedForPaymentMethodError(
        new Id(paymentMethodId),
      );
      jest.spyOn(service, 'findOne').mockRejectedValue(error);

      await controller.findOne(paymentMethodId, req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        error: new ForbiddenException(error),
        data: null,
        pagination: null,
      });
    });

    it('should throw PaymentMethodNotFoundError when payment method does not exist', async () => {
      const req = { user: { userId: '1' } } as unknown as AuthenticatedRequest;
      const paymentMethodId = new Id().toString();
      const error = new PaymentMethodNotFoundError(new Id(paymentMethodId));
      jest.spyOn(service, 'findOne').mockRejectedValue(error);

      await controller.findOne(paymentMethodId, req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        error: new NotFoundException(error),
        data: null,
        pagination: null,
      });
    });
  });

  describe('update a payment method', () => {
    const req = { user: { userId: '1' } } as unknown as AuthenticatedRequest;

    it('should update an existing payment method', async () => {
      const paymentMethod = new PaymentMethod(buildPaymentMethodEntity());
      jest.spyOn(service, 'update').mockResolvedValue(paymentMethod);

      await controller.update(paymentMethod.id.toString(), req, res, {
        name: paymentMethod.name,
        icon: paymentMethod.icon as string,
        color: paymentMethod.color as string,
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
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

      await controller.update(paymentMethod.id.toString(), req, res, {
        name: paymentMethod.name,
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
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
      const error = new NotAuthorizedForPaymentMethodError(
        new Id(paymentMethodId),
      );
      jest.spyOn(service, 'update').mockRejectedValue(error);

      await controller.update(paymentMethodId, req, res, {
        name: 'Test Payment Method',
      });

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        error: new ForbiddenException(error),
        data: null,
        pagination: null,
      });
    });

    it('should throw PaymentMethodNotFoundError when payment method does not exist', async () => {
      const paymentMethodId = new Id().toString();
      const error = new PaymentMethodNotFoundError(new Id(paymentMethodId));
      jest.spyOn(service, 'update').mockRejectedValue(error);

      await controller.update(paymentMethodId, req, res, {
        name: 'Test Payment Method',
      });

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        error: new NotFoundException(error),
        data: null,
        pagination: null,
      });
    });
  });
});
