import { Injectable } from '@nestjs/common';
import { Id, PaymentMethod } from '@gualet/shared';
import { DemoService } from '../demo.service';
import {
  PaymentMethodInUseError,
  PaymentMethodNotFoundError,
} from '@src/payment-methods/errors';
import { PaymentMethodToUpdate } from '@src/payment-methods';

@Injectable()
export class DemoPaymentMethodsRepository {
  constructor(private readonly demoService: DemoService) {}

  async create(userId: Id, pm: PaymentMethod): Promise<PaymentMethod> {
    const paymentMethods = this.demoService.getPaymentMethods();
    paymentMethods.set(pm.id.toString(), pm);
    return pm;
  }

  async findAll(userId: Id): Promise<PaymentMethod[]> {
    const paymentMethods = this.demoService.getPaymentMethods();
    return Array.from(paymentMethods.values());
  }

  async findOne(userId: Id, id: Id): Promise<PaymentMethod> {
    const paymentMethods = this.demoService.getPaymentMethods();
    const pm = paymentMethods.get(id.toString());

    if (!pm) {
      throw new PaymentMethodNotFoundError(id);
    }

    return pm;
  }

  async update(userId: Id, pm: PaymentMethodToUpdate): Promise<PaymentMethod> {
    const paymentMethods = this.demoService.getPaymentMethods();
    const existingPaymentMethod = paymentMethods.get(pm.id.toString());

    if (!existingPaymentMethod) {
      throw new PaymentMethodNotFoundError(pm.id);
    }

    // Create updated payment method
    const updatedPaymentMethod = new PaymentMethod({
      id: pm.id,
      name: pm.name ?? existingPaymentMethod.name,
      icon: pm.icon ?? existingPaymentMethod.icon,
      color: pm.color ?? existingPaymentMethod.color,
    });

    paymentMethods.set(pm.id.toString(), updatedPaymentMethod);
    return updatedPaymentMethod;
  }

  async delete(userId: Id, id: Id): Promise<void> {
    const paymentMethods = this.demoService.getPaymentMethods();
    const transactions = this.demoService.getTransactions();

    const pm = paymentMethods.get(id.toString());
    if (!pm) {
      throw new PaymentMethodNotFoundError(id);
    }

    // Check if payment method is in use
    const pmInUse = Array.from(transactions.values()).some(
      (tx) => tx.paymentMethodId === id.toString(),
    );

    if (pmInUse) {
      throw new PaymentMethodInUseError(id);
    }

    paymentMethods.delete(id.toString());
  }
}
