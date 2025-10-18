import { Nullable } from '@gualet/shared';
import { OperationType } from '@gualet/shared';

export interface CategoryDto {
  id: string;
  name: string;
  type: OperationType;
  icon: Nullable<string>;
  color: Nullable<string>;
}
