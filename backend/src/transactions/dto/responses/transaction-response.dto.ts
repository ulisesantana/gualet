import { TransactionDto } from './transaction.dto';
import { Transaction } from '@src/transactions';
import { BaseResponse } from '@src/common/infrastructure';
import { Nullable } from '@src/common/types';

interface Data {
  transaction: TransactionDto;
}

export class TransactionResponseDto extends BaseResponse<Data, unknown> {
  constructor(
    transaction: Nullable<Transaction>,
    error: Nullable<unknown> = null,
  ) {
    super(
      transaction
        ? {
            transaction: transaction.toJSON(),
          }
        : null,
      error,
    );
  }
}
