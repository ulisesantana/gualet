import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionEntity } from '@src/transactions/entities';
import { In, Repository } from 'typeorm';
import { Id, OperationType } from '@src/common/domain';
import { Transaction } from './transaction.model';
import {
  NotAuthorizedForTransactionError,
  TransactionNotFoundError,
} from './errors';
import { DateString, Nullable, TimeString } from '@src/common/types';
import { Category, CategoryEntity } from '@src/categories';
import {
  CategoryNotFoundError,
  NotAuthorizedForCategoryError,
} from '@src/categories/errors';
import { PaymentMethodNotFoundError } from '@src/payment-methods/errors';
import { PaymentMethod, PaymentMethodEntity } from '@src/payment-methods';

export interface FindTransactionsCriteria {
  from?: DateString;
  to?: DateString;
  categoryId?: Id;
  paymentMethodId?: Id;
  operation?: OperationType;
  sort?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

interface TransactionInput {
  id: Id;
  amount: number;
  categoryId: Id;
  date: TimeString;
  description?: string;
  operation: OperationType;
  paymentMethodId: Id;
}

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly repository: Repository<TransactionEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(PaymentMethodEntity)
    private readonly pmRepository: Repository<PaymentMethodEntity>,
  ) {}

  private static mapCategoryToDomain(category: CategoryEntity) {
    return new Category(category);
  }

  private static mapPaymentMethodToDomain(pm: PaymentMethodEntity) {
    return new PaymentMethod(pm);
  }

  async create(
    userId: Id,
    transaction: Omit<Transaction, 'id'>,
  ): Promise<Transaction> {
    // TODO: Validate transaction (e.g. check if category and payment method exist)
    const newTransaction = await this.repository.save({
      id: new Id().toString(),
      user_id: userId.toString(),
      category_id: transaction.category.id.toString(),
      payment_method_id: transaction.paymentMethod.id.toString(),
      amount: transaction.amount,
      description: transaction.description,
      operation: transaction.operation,
      date: transaction.date,
    });
    return this.mapToDomain(newTransaction);
  }

  async findAll(
    userId: Id,
    criteria: FindTransactionsCriteria,
  ): Promise<Transaction[]> {
    console.debug(criteria);
    // TODO: Use criteria to filter transactions
    const transactions = await this.repository.find({
      where: { user_id: userId.toString() },
    });
    const ids = this.extractRelations(transactions);
    const [categories, paymentMethods] = await Promise.all([
      this.categoryRepository.find({
        where: { id: In(ids.categoryIds) },
      }),
      this.pmRepository.find({
        where: { id: In(ids.paymentMethodIds) },
      }),
    ]);

    return transactions.map((transaction) => {
      const category = categories.find(
        (c) => c.id === transaction.category_id,
      )!;
      const pm = paymentMethods.find(
        (pm) => pm.id === transaction.payment_method_id,
      )!;
      this.validateCategoryForTransaction(category, transaction);
      this.validatePaymentMethodForTransaction(pm, transaction);
      return new Transaction({
        ...transaction,
        category: TransactionsService.mapCategoryToDomain(category),
        paymentMethod: TransactionsService.mapPaymentMethodToDomain(pm),
      });
    });
  }

  async findOne(id: Id, userId: Id): Promise<Transaction> {
    const transaction = await this.repository.findOneBy({
      id: id.toString(),
    });

    if (!transaction) {
      throw new TransactionNotFoundError(id);
    }

    if (!userId.equals(transaction.user_id)) {
      throw new NotAuthorizedForTransactionError(id);
    }

    return this.mapToDomain(transaction);
  }

  async save(userId: Id, transaction: TransactionInput): Promise<Transaction> {
    const existingTransaction = await this.repository.findOne({
      where: { id: transaction.id.toString() },
    });

    // TODO: Validate transaction (e.g. check if category and payment method exist)
    if (!existingTransaction) {
      throw new TransactionNotFoundError(transaction.id);
    }

    if (!userId.equals(existingTransaction.user_id)) {
      throw new NotAuthorizedForTransactionError(transaction.id);
    }

    const savedTransaction: TransactionEntity = await this.repository.save({
      ...transaction,
      id: transaction.id.toString(),
      user_id: userId.toString(),
      category_id: transaction.categoryId.toString(),
      payment_method_id: transaction.paymentMethodId.toString(),
    });
    return this.mapToDomain(savedTransaction);
  }

  private extractRelations(transactions: TransactionEntity[]) {
    return transactions.reduce(
      (acc, transaction) => {
        const category = transaction.category_id;
        const paymentMethod = transaction.payment_method_id;

        if (!acc.categoryIds.includes(category)) {
          acc.categoryIds.push(category);
        }

        if (!acc.paymentMethodIds.includes(paymentMethod)) {
          acc.paymentMethodIds.push(paymentMethod);
        }

        return acc;
      },
      { categoryIds: [], paymentMethodIds: [] } as {
        categoryIds: string[];
        paymentMethodIds: string[];
      },
    );
  }

  private async mapToDomain(transaction: TransactionEntity) {
    const [category, pm] = await Promise.all([
      this.categoryRepository.findOneBy({
        id: transaction.category_id,
      }),
      this.pmRepository.findOneBy({
        id: transaction.payment_method_id,
      }),
    ]);

    this.validateCategoryForTransaction(category, transaction);
    this.validatePaymentMethodForTransaction(pm, transaction);

    return new Transaction({
      ...transaction,
      category: new Category(category),
      paymentMethod: new PaymentMethod(pm),
    });
  }

  private validatePaymentMethodForTransaction(
    pm: Nullable<PaymentMethodEntity>,
    transaction: TransactionEntity,
  ): asserts pm is PaymentMethodEntity {
    if (!pm) {
      throw new PaymentMethodNotFoundError(
        new Id(transaction.payment_method_id),
      );
    }

    if (pm.user_id !== transaction.user_id) {
      throw new NotAuthorizedForCategoryError(
        new Id(transaction.payment_method_id),
      );
    }
  }

  private validateCategoryForTransaction(
    category: Nullable<CategoryEntity>,
    transaction: TransactionEntity,
  ): asserts category is CategoryEntity {
    if (!category) {
      throw new CategoryNotFoundError(new Id(transaction.category_id));
    }

    if (category.user_id !== transaction.user_id) {
      throw new NotAuthorizedForCategoryError(new Id(transaction.category_id));
    }
  }
}
