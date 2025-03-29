import { Required } from '@src/common/decorators';

export class CreatePaymentMethodDto {
  @Required('Groceries')
  name: string;

  @Required('🏦')
  icon?: string;

  @Required('#ffa200')
  color?: string;
}
