import { generateRandomId } from './generate-random-id';
import { UserEntity } from '@src/users';

export function buildUserEntity(
  overrides: Partial<UserEntity> = {},
): UserEntity {
  return {
    id: generateRandomId(),
    email: 'test@gualet.app',
    password: 'password123',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as UserEntity;
}
