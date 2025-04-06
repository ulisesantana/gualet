import { TransactionDto } from './transaction.dto';
import { Transaction } from '@src/transactions';
import { BaseResponse, Pagination } from '@src/common/infrastructure';
import { Nullable } from '@src/common/types';

interface Data {
  transactions: TransactionDto[];
}

export class TransactionsResponseDto extends BaseResponse<Data, unknown> {
  constructor(
    transactions: Nullable<Transaction[]>,
    error: Nullable<unknown> = null,
    pagination: Nullable<Pagination> = null,
  ) {
    super(
      transactions
        ? {
            transactions: transactions.map((t) => t.toJSON()),
          }
        : null,
      error,
      pagination,
    );
  }
}
