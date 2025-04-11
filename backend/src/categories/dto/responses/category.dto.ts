import { Nullable } from '@src/common/types';
import { OperationType } from '@src/common/domain';

export interface CategoryDto {
  id: string;
  name: string;
  type: OperationType;
  icon: Nullable<string>;
  color: Nullable<string>;
}
