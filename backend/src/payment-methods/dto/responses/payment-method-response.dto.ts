import { PaymentMethodDto } from './payment-method.dto';
import { SuccessResponse } from '@src/common/infrastructure';
import { PaymentMethod } from '@src/payment-methods';

interface Data {
  paymentMethod: PaymentMethodDto;
}

export class PaymentMethodResponseDto extends SuccessResponse<Data> {
  constructor(paymentMethod: PaymentMethod) {
    super({
      paymentMethod: paymentMethod.toJSON(),
    });
  }
}
