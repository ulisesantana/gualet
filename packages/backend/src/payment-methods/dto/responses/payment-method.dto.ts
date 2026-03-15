import { Nullable } from '@gualet/shared';

export interface PaymentMethodDto {
  id: string;
  name: string;
  icon: Nullable<string>;
  color: Nullable<string>;
}
