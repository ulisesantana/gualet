import { generateRandomId } from '@test/builders';
import { UserEntity } from '@src/db';

export function buildUserEntity(
  overrides: Partial<UserEntity> = {},
): UserEntity {
  return {
    id: generateRandomId(),
    email: 'test@gualet.app',
    password: 'password123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  } as UserEntity;
}
