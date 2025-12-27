import {Nullable, TimeString,} from "./types";
import {OperationType} from "./domain";

export interface CategoryDto {
  id: string;
  name: string;
  type: OperationType;
  icon: Nullable<string>;
  color: Nullable<string>;
}

export type UpdateCategoryDto = Omit<Partial<CategoryDto>, 'id'>;

export interface PaymentMethodDto {
  id: string;
  name: string;
  icon: Nullable<string>;
  color: Nullable<string>;
}

export type UpdatePaymentMethodDto = Omit<Partial<PaymentMethodDto>, 'id'>;

export interface TransactionDto {
  id: string;
  amount: number;
  category: CategoryDto;
  date: TimeString;
  description?: string;
  operation: OperationType;
  paymentMethod: PaymentMethodDto;
}

export type UpdateTransactionDto = Omit<Partial<TransactionDto>, 'id'>;
