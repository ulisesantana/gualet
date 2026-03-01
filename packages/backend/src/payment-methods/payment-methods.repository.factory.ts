import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { PaymentMethodsRepository } from './payment-methods.repository';
import { DemoPaymentMethodsRepository } from '@src/demo/repositories';
import { AuthenticatedRequest } from '@src/common/infrastructure';
import { Id, PaymentMethod } from '@gualet/shared';
import { PaymentMethodToUpdate } from './payment-methods.service';

export interface IPaymentMethodsRepository {
  findOne(userId: Id, id: Id): Promise<PaymentMethod>;
  findAll(userId: Id): Promise<PaymentMethod[]>;
  create(userId: Id, paymentMethod: PaymentMethod): Promise<PaymentMethod>;
  update(
    userId: Id,
    paymentMethod: PaymentMethodToUpdate,
  ): Promise<PaymentMethod>;
  delete(userId: Id, id: Id): Promise<void>;
}

@Injectable({ scope: Scope.REQUEST })
export class PaymentMethodsRepositoryFactory {
  constructor(
    @Inject(REQUEST) private readonly request: AuthenticatedRequest,
    private readonly dbRepository: PaymentMethodsRepository,
    private readonly demoRepository: DemoPaymentMethodsRepository,
  ) {}

  getRepository(): IPaymentMethodsRepository {
    if (this.request.user?.isDemo) {
      return this.demoRepository as IPaymentMethodsRepository;
    }
    return this.dbRepository as IPaymentMethodsRepository;
  }
}
