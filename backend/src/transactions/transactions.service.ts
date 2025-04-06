import { Injectable } from '@nestjs/common';
import { Id, OperationType } from '@src/common/domain';
import { Transaction } from './transaction.model';
import { TransactionNotFoundError } from './errors';
import { TimeString } from '@src/common/types';
import { FindTransactionsCriteria } from './dto';
import { TransactionsRepository } from './transactions.repository';

export interface TransactionToCreate {
  amount: number;
  categoryId: string;
  date: TimeString;
  description?: string;
  operation: OperationType;
  paymentMethodId: string;
}

export type TransactionToUpdate = Partial<TransactionToCreate> & { id: Id };

@Injectable()
export class TransactionsService {
  constructor(private readonly repository: TransactionsRepository) {}

  create(userId: Id, transaction: TransactionToCreate): Promise<Transaction> {
    const id = new Id();
    return this.repository.create(userId, { ...transaction, id });
  }

  findAll(
    userId: Id,
    { sort, page, pageSize, ...criteria }: FindTransactionsCriteria,
  ): Promise<Transaction[]> {
    return this.repository.find(userId, {
      ...criteria,
      sort: sort || 'asc',
      page: page || 1,
      pageSize: pageSize || 10,
    });
  }

  find(userId: Id, id: Id): Promise<Transaction> {
    return this.repository.findById(userId, id);
  }

  async update(
    userId: Id,
    transaction: TransactionToUpdate,
  ): Promise<Transaction> {
    const id = new Id(transaction.id);
    const existingTransaction = await this.repository.findById(userId, id);

    if (!existingTransaction) {
      throw new TransactionNotFoundError(transaction.id);
    }

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

  // TODO: Implement remove method
}
