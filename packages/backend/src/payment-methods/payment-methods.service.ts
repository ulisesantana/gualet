import { Injectable } from '@nestjs/common';
import { PaymentMethodsRepository } from '@src/payment-methods/payment-methods.repository';
import {
  generateDefaultPaymentMethods,
  Id,
  Nullable,
  PaymentMethod,
} from '@gualet/shared';

export interface PaymentMethodToUpdate {
  id: Id;
  name?: string;
  icon?: Nullable<string>;
  color?: Nullable<string>;
}

export interface PaymentMethodToCreate {
  name: string;
  icon?: string;
  color?: string;
}

@Injectable()
export class PaymentMethodsService {
  constructor(private readonly repository: PaymentMethodsRepository) {}

  create(userId: Id, pm: PaymentMethodToCreate): Promise<PaymentMethod> {
    return this.repository.create(
      userId,
      new PaymentMethod({ ...pm, id: new Id() }),
    );
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

  async createDefaultPaymentMethods(userId: Id): Promise<PaymentMethod[]> {
    const promises = generateDefaultPaymentMethods().map((pm) =>
      this.create(userId, {
        name: pm.name,
        icon: pm.icon,
        color: pm.color,
      }),
    );
    const result = await Promise.allSettled(promises);

    return result.reduce<PaymentMethod[]>((acc, res) => {
      if (res.status === 'fulfilled') {
        return acc.concat(res.value);
      } else {
        console.error('Failed to create default category:', res.reason);
      }
      return acc;
    }, []);
  }
}
