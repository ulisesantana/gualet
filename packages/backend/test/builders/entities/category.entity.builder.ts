import { buildUserEntity, generateRandomId } from '@test/builders';
import { Category } from '@src/categories';
import { Id, OperationType } from '@gualet/shared';
import { CategoryEntity } from '@src/db';

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
    id: new Id(entity.id),
    name: entity.name,
    type: entity.type,
    icon: entity.icon || undefined,
    color: entity.color || undefined,
  });
}
