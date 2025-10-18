import { Optional, Required } from '@src/common/decorators';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentMethodDto {
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
