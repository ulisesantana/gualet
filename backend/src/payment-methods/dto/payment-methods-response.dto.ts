import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethodDto } from './payment-method.dto';
import { PaymentMethod } from '@src/payment-methods/payment-method.model';

export class PaymentMethodsResponseDto {
  @ApiProperty()
  paymentMethods: PaymentMethodDto[];

  constructor(paymentMethods: PaymentMethod[]) {
    this.paymentMethods = paymentMethods.map((category) => category.toJSON());
  }
}
