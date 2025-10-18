import { Optional, Required } from '@src/common/decorators';
import { IsEnum } from 'class-validator';
import { OperationType } from '@gualet/shared';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Category name',
    example: 'Groceries',
  })
  @Required('Groceries')
  name: string;

  @ApiProperty({
    description: 'Category type (INCOME or OUTCOME)',
    enum: OperationType,
    example: OperationType.Outcome,
  })
  @Required('OUTCOME')
  @IsEnum(OperationType)
  type: OperationType;

  @ApiProperty({
    description: 'Category icon (emoji)',
    example: '🛒',
    required: false,
  })
  @Optional('🛒')
  icon?: string;

  @ApiProperty({
    description: 'Category color (hex)',
    example: '#ffa200',
    required: false,
  })
  @Optional('#ffa200')
  color?: string;
}
