import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  NotAuthorizedForPaymentMethodError,
  PaymentMethodNotFoundError,
  PaymentMethodInUseError,
} from './errors';
import { PaymentMethodToUpdate } from '@src/payment-methods';
import { PaymentMethodEntity, TransactionEntity } from '@src/db';
import { Id, PaymentMethod } from '@gualet/shared';

@Injectable()
export class PaymentMethodsRepository {
  constructor(
    @InjectRepository(PaymentMethodEntity)
    private readonly repository: Repository<PaymentMethodEntity>,
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}

  static mapToDomain(pm: PaymentMethodEntity) {
    return new PaymentMethod({
      id: new Id(pm.id),
      name: pm.name,
      icon: pm.icon ?? '',
      color: pm.color ?? '',
    });
  }

  async create(userId: Id, pm: PaymentMethod): Promise<PaymentMethod> {
    const entity = this.repository.create({
      ...pm.toJSON(),
      ...this.handleNullableFields(pm),
      user: { id: userId.toString() },
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
      ...this.handleNullableFields(pm, existingPaymentMethod),
      id: pm.id.toString(),
    });
    return PaymentMethodsRepository.mapToDomain(savedPaymentMethod);
  }

  private handleNullableFields(
    toUpdate: PaymentMethodToUpdate,
    existing?: PaymentMethodEntity,
  ) {
    return {
      icon:
        toUpdate.icon === null ? undefined : toUpdate.icon || existing?.icon,
      color:
        toUpdate.color === null ? undefined : toUpdate.color || existing?.color,
    };
  }

  async delete(userId: Id, id: Id): Promise<void> {
    const pm = await this.repository.findOne({
      where: { id: id.toString() },
    });

    if (!pm) {
      throw new PaymentMethodNotFoundError(id);
    }

    if (!userId.equals(pm.user.id)) {
      throw new NotAuthorizedForPaymentMethodError(id);
    }

    // Check if payment method is being used by any transactions
    const transactionCount = await this.transactionRepository.count({
      where: { payment_method: { id: id.toString() } },
    });

    if (transactionCount > 0) {
      throw new PaymentMethodInUseError(id);
    }

    await this.repository.delete({ id: id.toString() });
  }
}
