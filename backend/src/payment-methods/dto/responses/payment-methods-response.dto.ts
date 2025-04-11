import { PaymentMethodDto } from './payment-method.dto';
import { PaymentMethod } from '@src/payment-methods/payment-method.model';
import { SuccessResponse } from '@src/common/infrastructure';

interface Data {
  paymentMethods: PaymentMethodDto[];
}

export class PaymentMethodsResponseDto extends SuccessResponse<Data> {
  constructor(paymentMethods: PaymentMethod[]) {
    super({
      paymentMethods: paymentMethods.map((pm) => pm.toJSON()),
    });
  }
}
