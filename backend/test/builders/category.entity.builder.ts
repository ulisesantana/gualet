import { generateRandomId } from './generate-random-id';
import { CategoryEntity } from '@src/categories';
import { OperationType } from '@src/common/domain';

export function buildCategoryEntity({
  id = generateRandomId(),
  user_id = generateRandomId(),
  name = 'Category Name',
  icon = '🧪',
  color = '#FFFFFF',
  type = OperationType.Outcome,
}: Partial<CategoryEntity> = {}): CategoryEntity {
  return {
    id,
    user_id,
    name,
    icon,
    color,
    type,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as CategoryEntity;
}
