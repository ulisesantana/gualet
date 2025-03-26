import { OperationType } from '../../common/types';

export interface CategoryDto {
  id: string;
  name: string;
  type: OperationType;
  icon?: string;
}
