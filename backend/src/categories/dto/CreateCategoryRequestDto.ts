import { OperationType } from '../../common/types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryRequestDto {
  @ApiProperty({ example: 'Groceries' })
  name: string;

  @ApiProperty({ example: 'OUTCOME' })
  type: OperationType;

  @ApiProperty({ example: '🛒' })
  icon?: string;
}
