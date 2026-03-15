import { Injectable } from '@nestjs/common';
import { Id, OperationType, TimeString } from '@gualet/shared';
import { Transaction } from './transaction.model';
import { FindTransactionsCriteria } from './dto';
import { TransactionsRepositoryFactory } from './transactions.repository.factory';
import { Pagination } from '@src/common/infrastructure';

export interface TransactionToCreate {
  id: Id;
  amount: number;
  categoryId: string;
  date: TimeString;
  description?: string;
  operation: OperationType;
  paymentMethodId: string;
}

export type TransactionToUpdate = Partial<TransactionToCreate> & { id: Id };

export interface FindTransactionsResult {
  transactions: Transaction[];
  pagination: Pagination;
}

@Injectable()
export class TransactionsService {
  constructor(
    private readonly repositoryFactory: TransactionsRepositoryFactory,
  ) {}

  create(userId: Id, transaction: TransactionToCreate): Promise<Transaction> {
    return this.repositoryFactory.getRepository().create(userId, transaction);
  }

  find(
    userId: Id,
    { sort, page, pageSize, ...criteria }: FindTransactionsCriteria,
  ): Promise<FindTransactionsResult> {
    return this.repositoryFactory.getRepository().find(userId, {
      ...criteria,
      sort: sort || 'asc',
      page: page || 1,
      pageSize: pageSize || 10,
    });
  }

  findById(userId: Id, id: Id): Promise<Transaction> {
    return this.repositoryFactory.getRepository().findById(userId, id);
  }

  async update(
    userId: Id,
    transaction: TransactionToUpdate,
  ): Promise<Transaction> {
    const id = new Id(transaction.id);
    const existingTransaction = await this.repositoryFactory
      .getRepository()
      .findById(userId, id);

    return this.repositoryFactory.getRepository().update(userId, {
      ...existingTransaction,
      ...transaction,
      categoryId:
        transaction.categoryId || existingTransaction.category.id.toString(),
      paymentMethodId:
        transaction.paymentMethodId ||
        existingTransaction.paymentMethod.id.toString(),
    });
  }

  delete(userId: Id, id: Id): Promise<void> {
    return this.repositoryFactory.getRepository().delete(userId, id);
  }
}
