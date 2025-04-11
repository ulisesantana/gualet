import { Injectable } from '@nestjs/common';
import { Id } from '@src/common/domain';
import { PaymentMethod } from './payment-method.model';
import { PaymentMethodsRepository } from '@src/payment-methods/payment-methods.repository';

export type PaymentMethodToUpdate = Partial<PaymentMethod> & { id: Id };

@Injectable()
export class PaymentMethodsService {
  constructor(private readonly repository: PaymentMethodsRepository) {}

  create(userId: Id, pm: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> {
    return this.repository.create(userId, { ...pm, id: new Id() });
  }

  findAll(userId: Id): Promise<PaymentMethod[]> {
    return this.repository.findAll(userId);
  }

  findOne(userId: Id, id: Id): Promise<PaymentMethod> {
    return this.repository.findOne(userId, id);
  }

  update(userId: Id, pm: PaymentMethodToUpdate): Promise<PaymentMethod> {
    return this.repository.update(userId, pm);
  }
}
