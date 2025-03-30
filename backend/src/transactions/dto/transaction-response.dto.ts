import { ApiProperty } from '@nestjs/swagger';
import { TransactionDto } from './transaction.dto';
import { Transaction } from '../transaction.model';

export class TransactionResponseDto {
  @ApiProperty()
  transaction: TransactionDto;

  constructor(transaction: Transaction) {
    this.transaction = transaction.toJSON();
  }
}
