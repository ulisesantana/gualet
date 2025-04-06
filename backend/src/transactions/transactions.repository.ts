import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionEntity } from './entities';
import {
  Between,
  FindManyOptions,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
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
import { Pagination } from '@src/common/infrastructure';

type TransactionPayload = TransactionToCreate & { id: Id };

@Injectable()
export class TransactionsRepository {
  private readonly categoryRepository: Repository<CategoryEntity>;
  private readonly paymentMethodRepository: Repository<PaymentMethodEntity>;

  constructor(
    @InjectRepository(TransactionEntity)
    private readonly entityRepository: Repository<TransactionEntity>,
  ) {
    this.categoryRepository =
      entityRepository.manager.getRepository(CategoryEntity);
    this.paymentMethodRepository =
      entityRepository.manager.getRepository(PaymentMethodEntity);
  }

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
    return this.findById(userId, transaction.id);
  }

  async findById(userId: Id, id: Id): Promise<Transaction> {
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

    return TransactionsRepository.mapToDomain(transaction);
  }

  async find(
    userId: Id,
    criteria: FindTransactionsCriteria & {
      sort: 'asc' | 'desc';
      page: number;
      pageSize: number;
    },
  ): Promise<{ pagination: Pagination; transactions: Transaction[] }> {
    const where: FindManyOptions<TransactionEntity>['where'] = {
      user: { id: userId.toString() },
    };
    const {
      from,
      to,
      categoryId,
      paymentMethodId,
      operation,
      sort,
      page,
      pageSize,
    } = criteria;
    if (categoryId) {
      where.category = { id: categoryId };
    }
    if (paymentMethodId) {
      where.payment_method = { id: paymentMethodId };
    }
    if (operation) {
      where.operation = operation;
    }
    if (from && !to) {
      where.date = MoreThanOrEqual(new Date(from)) as any;
    }
    if (from && to) {
      where.date = Between(new Date(from), new Date(to)) as any;
    }
    if (!from && to) {
      where.date = LessThanOrEqual(new Date(to)) as any;
    }

    const order = { date: sort } as any;
    const relations = ['category', 'payment_method', 'user'];
    if (pageSize === 0) {
      const transactions = await this.entityRepository.find({
        where,
        order,
        relations,
      });

      return {
        pagination: new Pagination({
          total: transactions.length,
          page: 1,
          pageSize: transactions.length,
        }),
        transactions: transactions.map(TransactionsRepository.mapToDomain),
      };
    }

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const transactions = await this.entityRepository.find({
      where,
      order,
      skip,
      take,
      relations,
    });

    return {
      pagination: new Pagination({
        total: await this.entityRepository.count({ where }),
        page,
        pageSize,
      }),
      transactions: transactions.map(TransactionsRepository.mapToDomain),
    };
  }

  async update(
    userId: Id,
    transaction: TransactionPayload,
  ): Promise<Transaction> {
    const existingTransaction = await this.entityRepository.findOne({
      where: { id: transaction.id.toString() },
    });

    if (!existingTransaction) {
      throw new TransactionNotFoundError(transaction.id);
    }

    if (!userId.equals(existingTransaction.user.id)) {
      throw new NotAuthorizedForTransactionError(transaction.id);
    }

    await this.validateTransactionRelationship(userId, transaction);

    const savedTransaction: TransactionEntity =
      await this.entityRepository.save({
        ...transaction,
        id: transaction.id.toString(),
        user: { id: userId.toString() },
        category: { id: transaction.categoryId },
        payment_method: { id: transaction.paymentMethodId },
      });
    return TransactionsRepository.mapToDomain(savedTransaction);
  }

  async delete(userId: Id, transactionId: Id): Promise<void> {
    const existingTransaction = await this.entityRepository.findOne({
      where: { id: transactionId.toString() },
    });

    if (!existingTransaction) {
      throw new TransactionNotFoundError(transactionId);
    }

    if (!userId.equals(existingTransaction.user.id)) {
      throw new NotAuthorizedForTransactionError(transactionId);
    }

    await this.entityRepository.delete({ id: transactionId.toString() });
  }

  private async validateTransactionRelationship(
    userId: Id,
    transaction: TransactionPayload,
  ): Promise<void> {
    const [category, paymentMethod] = await Promise.all([
      this.categoryRepository.findOne({
        where: { id: transaction.categoryId },
      }),
      this.paymentMethodRepository.findOne({
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
