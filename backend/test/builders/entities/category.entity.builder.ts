import { buildUserEntity, generateRandomId } from '@test/builders';
import { Category, CategoryEntity } from '@src/categories';
import { OperationType } from '@src/common/domain';

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

export function buildCategory(
  overrides: Partial<CategoryEntity> = {},
): Category {
  const entity = buildCategoryEntity(overrides);
  return new Category({
    ...entity,
  });
}
