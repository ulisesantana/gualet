import { Optional } from '@src/common/decorators';
import { Nullable } from '@gualet/shared';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePaymentMethodDto {
  @ApiProperty({
    description: 'Payment method name',
    example: 'Cash',
    required: false,
  })
  @Optional('Groceries')
  name?: string;

  @ApiProperty({
    description: 'Payment method icon (emoji)',
    example: '💵',
    required: false,
  })
  @Optional('🏦')
  icon?: Nullable<string>;

  @ApiProperty({
    description: 'Payment method color (hex)',
    example: '#4caf50',
    required: false,
  })
  @Optional('#ffa200')
  color?: Nullable<string>;
}
