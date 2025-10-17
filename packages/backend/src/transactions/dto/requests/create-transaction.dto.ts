import { Optional, Required } from '@src/common/decorators';
import { TimeString } from '@src/common/types';
import { OperationType } from '@src/common/domain';

export class CreateTransactionDto {
  @Optional('Lunch with friends')
  description: string;

  @Required('10.00')
  amount: number;

  @Required('cca72c21-a4e1-4845-8c6e-27b608e423ab')
  categoryId: string;

  @Required('2025-03-30T09:38:07.415Z')
  date: TimeString;

  @Required('OUTCOME')
  operation: OperationType;

  @Required('a3e23c3c-6dae-4783-84e6-753f44038cd4')
  paymentMethodId: string;
}
