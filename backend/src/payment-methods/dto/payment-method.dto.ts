import { Nullable } from '@src/common/types';

export interface PaymentMethodDto {
  id: string;
  name: string;
  icon: Nullable<string>;
  color: Nullable<string>;
}
