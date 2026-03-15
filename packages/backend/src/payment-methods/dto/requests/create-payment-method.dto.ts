import { Optional, Required } from '@src/common/decorators';
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreatePaymentMethodDto {
  @ApiProperty({
    description: 'Payment method uuid',
    example: 'b1a7f1e2-3c4d-5e6f-7a8b-9c0d1e2f3a4b',
  })
  @Required('b1a7f1e2-3c4d-5e6f-7a8b-9c0d1e2f3a4b')
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Payment method name',
    example: 'Cash',
  })
  @Required('Groceries')
  name: string;

  @ApiProperty({
    description: 'Payment method icon (emoji)',
    example: '💵',
    required: false,
  })
  @Optional('🏦')
  icon?: string;

  @ApiProperty({
    description: 'Payment method color (hex)',
    example: '#4caf50',
    required: false,
  })
  @Optional('#ffa200')
  color?: string;
}
