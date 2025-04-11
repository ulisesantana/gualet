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
import { PaymentMethodToUpdate } from '@src/payment-methods';

@Injectable()
export class PaymentMethodsRepository {
  constructor(
    @InjectRepository(PaymentMethodEntity)
    private readonly repository: Repository<PaymentMethodEntity>,
  ) {}

  static mapToDomain(pm: PaymentMethodEntity) {
    return new PaymentMethod(pm);
  }

  async create(userId: Id, pm: PaymentMethod): Promise<PaymentMethod> {
    const entity = this.repository.create({
      ...pm.toJSON(),
      user: { id: userId.toString() },
      icon: pm.icon ?? undefined,
      color: pm.color ?? undefined,
    });
    const newPaymentMethod = await this.repository.save(entity);
    return PaymentMethodsRepository.mapToDomain(newPaymentMethod);
  }

  async findAll(userId: Id): Promise<PaymentMethod[]> {
    const categories = await this.repository.find({
      where: { user: { id: userId.toString() } },
    });

    return categories.map(PaymentMethodsRepository.mapToDomain);
  }

  async findOne(userId: Id, id: Id): Promise<PaymentMethod> {
    const pm = await this.repository.findOneBy({
      id: id.toString(),
    });

    if (!pm) {
      throw new PaymentMethodNotFoundError(id);
    }

    if (!userId.equals(pm.user.id)) {
      throw new NotAuthorizedForPaymentMethodError(id);
    }

    return PaymentMethodsRepository.mapToDomain(pm);
  }

  async update(userId: Id, pm: PaymentMethodToUpdate): Promise<PaymentMethod> {
    const existingPaymentMethod = await this.repository.findOne({
      where: { id: pm.id.toString() },
    });

    if (!existingPaymentMethod) {
      throw new PaymentMethodNotFoundError(pm.id);
    }

    if (!userId.equals(existingPaymentMethod.user.id)) {
      throw new NotAuthorizedForPaymentMethodError(pm.id);
    }

    const savedPaymentMethod = await this.repository.save({
      ...existingPaymentMethod,
      ...pm,
      ...this.handleNullableFields(existingPaymentMethod, pm),
      id: pm.id.toString(),
    });
    return PaymentMethodsRepository.mapToDomain(savedPaymentMethod);
  }

  private handleNullableFields(
    existing: PaymentMethodEntity,
    toUpdate: PaymentMethodToUpdate,
  ) {
    return {
      icon: toUpdate.icon === null ? undefined : toUpdate.icon || existing.icon,
      color:
        toUpdate.color === null ? undefined : toUpdate.color || existing.color,
    };
  }
}
