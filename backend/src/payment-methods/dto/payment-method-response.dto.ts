import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '../payment-method.model';
import { PaymentMethodDto } from './payment-method.dto';

export class PaymentMethodResponseDto {
  @ApiProperty()
  paymentMethod: PaymentMethodDto;

  constructor(pm: PaymentMethod) {
    this.paymentMethod = pm.toJSON();
  }
}
