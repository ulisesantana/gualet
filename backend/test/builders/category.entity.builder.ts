import { generateRandomId } from './generate-random-id';
import { CategoryEntity } from '@src/categories';
import { OperationType } from '@src/common/domain';
import { buildUserEntity } from './user.entity.builder';

export function buildCategoryEntity(
  overrides: Partial<CategoryEntity> = {},
): CategoryEntity {
  return {
    id: generateRandomId(),
    user: buildUserEntity({ id: 'user-123' }),
    name: 'Category Name',
    icon: '🧪',
    color: '#FFFFFF',
    type: OperationType.Outcome,
    createdAt: new Date(),
    updatedAt: new Date(),

    ...overrides,
  } as CategoryEntity;
}
