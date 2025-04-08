import { Optional } from '@src/common/decorators';
import { IsEnum } from 'class-validator';
import { OperationType } from '@src/common/domain';

export class UpdateCategoryDto {
  @Optional('Groceries')
  name?: string;

  @Optional('OUTCOME')
  @IsEnum(OperationType)
  type?: OperationType;

  @Optional('🛒')
  icon?: string;

  @Optional('#ffa200')
  color?: string;
}
