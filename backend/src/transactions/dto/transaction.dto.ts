import { DateString } from '@src/common/types';
import { OperationType } from '@src/common/domain';
import { CategoryDto } from '@src/categories/dto';
import { PaymentMethodDto } from '@src/payment-methods/dto';

export interface TransactionDto {
  id: string;
  amount: number;
  category: CategoryDto;
  date: DateString;
  description?: string;
  operation: OperationType;
  paymentMethod: PaymentMethodDto;
}
