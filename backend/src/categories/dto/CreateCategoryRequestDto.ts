import { OperationType } from '../../common/types';
import { Optional, Required } from '../../common/decorators';
import { IsEnum } from 'class-validator';

export class CreateCategoryRequestDto {
  @Required('Groceries')
  name: string;

  @Required('OUTCOME')
  @IsEnum(OperationType)
  type: OperationType;

  @Optional('🛒')
  icon?: string;
}
