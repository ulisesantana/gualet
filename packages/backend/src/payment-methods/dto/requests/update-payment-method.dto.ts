import { Optional } from '@src/common/decorators';
import { Nullable } from '@src/common/types';

export class UpdatePaymentMethodDto {
  @Optional('Groceries')
  name?: string;

  @Optional('🏦')
  icon?: Nullable<string>;

  @Optional('#ffa200')
  color?: Nullable<string>;
}
