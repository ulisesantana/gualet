import { Optional, Required } from '@src/common/decorators';

export class CreatePaymentMethodDto {
  @Required('Groceries')
  name: string;

  @Optional('🏦')
  icon?: string;

  @Optional('#ffa200')
  color?: string;
}
