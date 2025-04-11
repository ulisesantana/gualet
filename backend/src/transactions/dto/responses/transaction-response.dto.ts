import { TransactionDto } from './transaction.dto';
import { Transaction } from '@src/transactions';
import { SuccessResponse } from '@src/common/infrastructure';

interface Data {
  transaction: TransactionDto;
}

export class TransactionResponseDto extends SuccessResponse<Data> {
  constructor(transaction: Transaction) {
    super({
      transaction: transaction.toJSON(),
    });
  }
}
