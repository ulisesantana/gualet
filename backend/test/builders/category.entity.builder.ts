import { generateRandomId } from './generate-random-id';
import { CategoryEntity } from '@src/categories';
import { OperationType } from '@src/common/domain';

export function buildCategoryEntity(
  overrides: Partial<CategoryEntity> = {},
): CategoryEntity {
  return {
    id: generateRandomId(),
    user_id: generateRandomId(),
    name: 'Category Name',
    icon: '🧪',
    color: '#FFFFFF',
    type: OperationType.Outcome,
    createdAt: new Date(),
    updatedAt: new Date(),

    ...overrides,
  } as CategoryEntity;
}
