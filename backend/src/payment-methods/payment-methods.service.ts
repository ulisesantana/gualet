import { Injectable } from '@nestjs/common';
import { Id } from '@src/common/domain';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentMethodEntity } from '@src/payment-methods/entities/payment-method.entity';
import { Repository } from 'typeorm';
import { PaymentMethod } from './payment-method.model';
import {
  NotAuthorizedForPaymentMethodError,
  PaymentMethodNotFoundError,
} from './errors';

@Injectable()
export class PaymentMethodsService {
  constructor(
    @InjectRepository(PaymentMethodEntity)
    private readonly repository: Repository<PaymentMethodEntity>,
  ) {}

  static mapToDomain(pm: PaymentMethodEntity) {
    return new PaymentMethod(pm);
  }

  async create(
    userId: Id,
    pm: Omit<PaymentMethod, 'id'>,
  ): Promise<PaymentMethod> {
    const newPaymentMethod = await this.repository.save({
      ...pm,
      user_id: userId.toString(),
      id: new Id().toString(),
      icon: pm.icon ?? undefined,
      color: pm.color ?? undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return PaymentMethodsService.mapToDomain(newPaymentMethod);
  }

  async findAll(userId: Id): Promise<PaymentMethod[]> {
    const categories = await this.repository.find({
      where: { user_id: userId.toString() },
    });

    return categories.map(PaymentMethodsService.mapToDomain);
  }

  async findOne(id: Id, userId: Id): Promise<PaymentMethod> {
    const pm = await this.repository.findOneBy({
      id: id.toString(),
    });

    if (!pm) {
      throw new PaymentMethodNotFoundError(id);
    }

    if (!userId.equals(pm.user_id)) {
      throw new NotAuthorizedForPaymentMethodError(id);
    }

    return PaymentMethodsService.mapToDomain(pm);
  }

  async save(userId: Id, pm: PaymentMethod): Promise<PaymentMethod> {
    const existingPaymentMethod = await this.repository.findOne({
      where: { id: pm.id.toString() },
    });

    if (!existingPaymentMethod) {
      throw new PaymentMethodNotFoundError(pm.id);
    }

    if (!userId.equals(existingPaymentMethod.user_id)) {
      throw new NotAuthorizedForPaymentMethodError(pm.id);
    }

    const savedPaymentMethod = await this.repository.save({
      ...pm,
      id: pm.id.toString(),
      icon: pm.icon ?? undefined,
      color: pm.color ?? undefined,
      updatedAt: new Date().toISOString(),
    });
    return PaymentMethodsService.mapToDomain(savedPaymentMethod);
  }
}
