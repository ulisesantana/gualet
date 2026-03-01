import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { TransactionsRepository } from './transactions.repository';
import { DemoTransactionsRepository } from '@src/demo/repositories';
import { AuthenticatedRequest, Pagination } from '@src/common/infrastructure';
import { Id } from '@gualet/shared';
import { Transaction } from './transaction.model';
import { FindTransactionsCriteria } from './dto';
import { TransactionToCreate } from './transactions.service';

export interface ITransactionsRepository {
  create(
    userId: Id,
    transaction: TransactionToCreate & { id: Id },
  ): Promise<Transaction>;
  findById(userId: Id, id: Id): Promise<Transaction>;
  find(
    userId: Id,
    criteria: FindTransactionsCriteria & {
      sort: 'asc' | 'desc';
      page: number;
      pageSize: number;
    },
  ): Promise<{ pagination: Pagination; transactions: Transaction[] }>;
  update(
    userId: Id,
    transaction: TransactionToCreate & { id: Id },
  ): Promise<Transaction>;
  delete(userId: Id, transactionId: Id): Promise<void>;
}

@Injectable({ scope: Scope.REQUEST })
export class TransactionsRepositoryFactory {
  constructor(
    @Inject(REQUEST) private readonly request: AuthenticatedRequest,
    private readonly dbRepository: TransactionsRepository,
    private readonly demoRepository: DemoTransactionsRepository,
  ) {}

  getRepository(): ITransactionsRepository {
    if (this.request.user?.isDemo) {
      return this.demoRepository as ITransactionsRepository;
    }
    return this.dbRepository as ITransactionsRepository;
  }
}
