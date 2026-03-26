import { Injectable, Logger } from '@nestjs/common';
import { PaymentMethodsRepositoryFactory } from './payment-methods.repository.factory';
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
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

@Injectable()
export class PaymentMethodsService {
  private readonly logger = new Logger(PaymentMethodsService.name);

  constructor(
    private readonly repositoryFactory: PaymentMethodsRepositoryFactory,
  ) {}

  create(userId: Id, pm: PaymentMethodToCreate): Promise<PaymentMethod> {
    return this.repositoryFactory
      .getRepository()
      .create(userId, new PaymentMethod({ ...pm, id: new Id(pm.id) }));
  }

  findAll(userId: Id): Promise<PaymentMethod[]> {
    return this.repositoryFactory.getRepository().findAll(userId);
  }

  findOne(userId: Id, id: Id): Promise<PaymentMethod> {
    return this.repositoryFactory.getRepository().findOne(userId, id);
  }

  update(userId: Id, pm: PaymentMethodToUpdate): Promise<PaymentMethod> {
    return this.repositoryFactory.getRepository().update(userId, pm);
  }

  delete(userId: Id, id: Id): Promise<void> {
    return this.repositoryFactory.getRepository().delete(userId, id);
  }

  async createDefaultPaymentMethods(userId: Id): Promise<PaymentMethod[]> {
    const promises = generateDefaultPaymentMethods().map((pm) =>
      this.create(userId, {
        id: pm.id.toString(),
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
        this.logger.error(
          'Failed to create default payment method:',
          res.reason,
        );
      }
      return acc;
    }, []);
  }
}
