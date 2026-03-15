import { TimeString } from '@gualet/shared';
import { OperationType } from '@gualet/shared';
import { CategoryDto } from '@src/categories/dto';
import { PaymentMethodDto } from '@src/payment-methods/dto';

export interface TransactionDto {
  id: string;
  amount: number;
  category: CategoryDto;
  date: TimeString;
  description?: string;
  operation: OperationType;
  paymentMethod: PaymentMethodDto;
}
