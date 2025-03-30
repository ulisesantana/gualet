import { ApiProperty } from '@nestjs/swagger';
import { TransactionDto } from './transaction.dto';
import { PaymentMethod } from '@src/payment-methods/payment-method.model';

export class TransactionsResponseDto {
  @ApiProperty()
  paymentMethods: TransactionDto[];

  constructor(paymentMethods: PaymentMethod[]) {
    this.paymentMethods = paymentMethods.map((category) => category.toJSON());
  }
}
