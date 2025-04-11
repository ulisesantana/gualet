import { PaymentMethodDto } from './payment-method.dto';
import { BaseResponse } from '@src/common/infrastructure';
import { Nullable } from '@src/common/types';
import { PaymentMethod } from '@src/payment-methods';

interface Data {
  paymentMethod: PaymentMethodDto;
}

export class PaymentMethodResponseDto extends BaseResponse<Data, unknown> {
  constructor(
    paymentMethod: Nullable<PaymentMethod>,
    error: Nullable<unknown> = null,
  ) {
    super(
      paymentMethod
        ? {
            paymentMethod: paymentMethod.toJSON(),
          }
        : null,
      error,
    );
  }
}
