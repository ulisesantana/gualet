import { PaymentMethodDto } from './payment-method.dto';
import { PaymentMethod } from '@src/payment-methods/payment-method.model';
import { BaseResponse, Pagination } from '@src/common/infrastructure';
import { Nullable } from '@src/common/types';

interface Data {
  paymentMethods: PaymentMethodDto[];
}

export class PaymentMethodsResponseDto extends BaseResponse<Data, unknown> {
  constructor(
    paymentMethods: Nullable<PaymentMethod[]>,
    error: Nullable<unknown> = null,
    pagination: Nullable<Pagination> = null,
  ) {
    super(
      paymentMethods
        ? {
            paymentMethods: paymentMethods.map((pm) => pm.toJSON()),
          }
        : null,
      error,
      pagination,
    );
  }
}
