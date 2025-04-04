import { ApiProperty } from '@nestjs/swagger';
import { TransactionDto } from './transaction.dto';
import { Transaction } from '@src/transactions';

export class TransactionsResponseDto {
  @ApiProperty()
  transactions: TransactionDto[];

  constructor(transactions: Transaction[]) {
    this.transactions = transactions.map((t) => t.toJSON());
  }
}
