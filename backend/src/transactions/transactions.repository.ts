import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionEntity } from './entities';
import { Repository } from 'typeorm';
import { Id } from '@src/common/domain';
import { Transaction } from './transaction.model';
import {
  NotAuthorizedForTransactionError,
  TransactionNotFoundError,
} from './errors';
import { Category, CategoryEntity } from '@src/categories';
import { PaymentMethod, PaymentMethodEntity } from '@src/payment-methods';
import { FindTransactionsCriteria } from './dto';
import {
  CategoryNotFoundError,
  NotAuthorizedForCategoryError,
} from '@src/categories/errors';
import {
  NotAuthorizedForPaymentMethodError,
  PaymentMethodNotFoundError,
} from '@src/payment-methods/errors';
import { TransactionToCreate } from './transactions.service';

type TransactionPayload = TransactionToCreate & { id: Id };

export interface TransactionRepository {
  create(userId: Id, transaction: TransactionPayload): Promise<Transaction>;

  find(userId: Id, criteria: FindTransactionsCriteria): Promise<Transaction[]>;

  finById(userId: Id, id: Id): Promise<Transaction>;

  update(userId: Id, transaction: TransactionPayload): Promise<Transaction>;

  // delete(userId: Id, id: Id): Promise<void>;
}

@Injectable()
export class TransactionsRepositoryImpl implements TransactionRepository {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly entityRepository: Repository<TransactionEntity>,
  ) {}

  static mapToDomain(transaction: TransactionEntity) {
    return new Transaction({
      ...transaction,
      category: new Category(transaction.category),
      paymentMethod: new PaymentMethod(transaction.payment_method),
    });
  }

  async create(
    userId: Id,
    transaction: TransactionPayload,
  ): Promise<Transaction> {
    await this.validateTransactionRelationship(userId, transaction);
    await this.entityRepository.save({
      id: transaction.id.toString(),
      user: { id: userId.toString() },
      category: { id: transaction.categoryId },
      payment_method: { id: transaction.paymentMethodId },
      amount: transaction.amount,
      description: transaction.description,
      operation: transaction.operation,
      date: transaction.date,
    });
    return this.finById(userId, transaction.id);
  }

  async finById(userId: Id, id: Id): Promise<Transaction> {
    const transaction = await this.entityRepository.findOne({
      where: {
        id: id.toString(),
      },
      relations: ['category', 'payment_method', 'user'],
    });

    if (!transaction) {
      throw new TransactionNotFoundError(id);
    }

    if (!userId.equals(transaction.user.id)) {
      throw new NotAuthorizedForTransactionError(id);
    }

    return TransactionsRepositoryImpl.mapToDomain(transaction);
  }

  async find(
    userId: Id,
    criteria: FindTransactionsCriteria,
  ): Promise<Transaction[]> {
    console.debug(criteria);
    // TODO: Use criteria to filter transactions
    const transactions = await this.entityRepository.find({
      where: { user: { id: userId.toString() } },
      relations: ['category', 'payment_method', 'user'],
    });

    return transactions.map(TransactionsRepositoryImpl.mapToDomain);
  }

  async update(
    userId: Id,
    transaction: TransactionPayload,
  ): Promise<Transaction> {
    const existingTransaction = await this.entityRepository.findOne({
      where: { id: transaction.id.toString() },
    });

    await this.validateTransactionRelationship(userId, transaction);

    if (!existingTransaction) {
      throw new TransactionNotFoundError(transaction.id);
    }

    if (!userId.equals(existingTransaction.user.id)) {
      throw new NotAuthorizedForTransactionError(transaction.id);
    }

    const savedTransaction: TransactionEntity =
      await this.entityRepository.save({
        ...transaction,
        id: transaction.id.toString(),
        user: { id: userId.toString() },
        category: { id: transaction.categoryId },
        payment_method: { id: transaction.paymentMethodId },
      });
    return TransactionsRepositoryImpl.mapToDomain(savedTransaction);
  }

  private async validateTransactionRelationship(
    userId: Id,
    transaction: TransactionPayload,
  ): Promise<void> {
    const categoryRepo =
      this.entityRepository.manager.getRepository(CategoryEntity);
    const paymentMethodRepo =
      this.entityRepository.manager.getRepository(PaymentMethodEntity);

    const [category, paymentMethod] = await Promise.all([
      categoryRepo.findOne({
        where: { id: transaction.categoryId },
      }),
      paymentMethodRepo.findOne({
        where: {
          id: transaction.paymentMethodId,
        },
      }),
    ]);

    if (!category) {
      throw new CategoryNotFoundError(new Id(transaction.categoryId));
    }

    if (!userId.equals(category.user.id)) {
      throw new NotAuthorizedForCategoryError(new Id(transaction.categoryId));
    }

    if (!paymentMethod) {
      throw new PaymentMethodNotFoundError(new Id(transaction.paymentMethodId));
    }

    if (!userId.equals(paymentMethod.user.id)) {
      throw new NotAuthorizedForPaymentMethodError(
        new Id(transaction.paymentMethodId),
      );
    }
  }
}
