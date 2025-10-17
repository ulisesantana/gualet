import { Optional, Required } from '@src/common/decorators';
import { IsEnum } from 'class-validator';
import { OperationType } from '@src/common/domain';

export class CreateCategoryDto {
  @Required('Groceries')
  name: string;

  @Required('OUTCOME')
  @IsEnum(OperationType)
  type: OperationType;

  @Optional('🛒')
  icon?: string;

  @Optional('#ffa200')
  color?: string;
}
