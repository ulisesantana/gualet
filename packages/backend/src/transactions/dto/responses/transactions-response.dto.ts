import { TransactionDto } from './transaction.dto';
import { Transaction } from '@src/transactions';
import { Pagination, SuccessResponse } from '@src/common/infrastructure';

interface Data {
  transactions: TransactionDto[];
}

export class TransactionsResponseDto extends SuccessResponse<Data> {
  constructor(transactions: Transaction[], pagination: Pagination) {
    super(
      {
        transactions: transactions.map((t) => t.toJSON()),
      },
      pagination,
    );
  }
}
