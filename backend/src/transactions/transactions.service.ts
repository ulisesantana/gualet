import { Injectable } from '@nestjs/common';
import { Id, OperationType } from '@src/common/domain';
import { Transaction } from './transaction.model';
import { TimeString } from '@src/common/types';
import { FindTransactionsCriteria } from './dto';
import { TransactionsRepository } from './transactions.repository';
import { Pagination } from '@src/common/infrastructure';

export interface TransactionToCreate {
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
  constructor(private readonly repository: TransactionsRepository) {}

  create(userId: Id, transaction: TransactionToCreate): Promise<Transaction> {
    const id = new Id();
    return this.repository.create(userId, { ...transaction, id });
  }

  find(
    userId: Id,
    { sort, page, pageSize, ...criteria }: FindTransactionsCriteria,
  ): Promise<FindTransactionsResult> {
    return this.repository.find(userId, {
      ...criteria,
      sort: sort || 'asc',
      page: page || 1,
      pageSize: pageSize || 10,
    });
  }

  findById(userId: Id, id: Id): Promise<Transaction> {
    return this.repository.findById(userId, id);
  }

  async update(
    userId: Id,
    transaction: TransactionToUpdate,
  ): Promise<Transaction> {
    const id = new Id(transaction.id);
    const existingTransaction = await this.repository.findById(userId, id);

    return this.repository.update(userId, {
      ...existingTransaction,
      ...transaction,
      categoryId:
        transaction.categoryId || existingTransaction.category.id.toString(),
      paymentMethodId:
        transaction.paymentMethodId ||
        existingTransaction.paymentMethod.id.toString(),
    });
  }

  async delete(userId: Id, id: Id): Promise<void> {
    return this.repository.delete(userId, id);
  }
}
