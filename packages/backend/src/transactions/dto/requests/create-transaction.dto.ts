import { Optional, Required } from '@src/common/decorators';
import { TimeString } from '@gualet/shared';
import { OperationType } from '@gualet/shared';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Transaction description',
    example: 'Lunch with friends',
    required: false,
  })
  @Optional('Lunch with friends')
  description: string;

  @ApiProperty({
    description: 'Transaction amount',
    example: 10.0,
  })
  @Required('10.00')
  amount: number;

  @ApiProperty({
    description: 'Category ID',
    example: 'cca72c21-a4e1-4845-8c6e-27b608e423ab',
  })
  @Required('cca72c21-a4e1-4845-8c6e-27b608e423ab')
  categoryId: string;

  @ApiProperty({
    description: 'Transaction date (ISO 8601 format)',
    example: '2025-03-30T09:38:07.415Z',
  })
  @Required('2025-03-30T09:38:07.415Z')
  date: TimeString;

  @ApiProperty({
    description: 'Operation type (INCOME or OUTCOME)',
    enum: OperationType,
    example: OperationType.Outcome,
  })
  @Required('OUTCOME')
  operation: OperationType;

  @ApiProperty({
    description: 'Payment method ID',
    example: 'a3e23c3c-6dae-4783-84e6-753f44038cd4',
  })
  @Required('a3e23c3c-6dae-4783-84e6-753f44038cd4')
  paymentMethodId: string;
}
