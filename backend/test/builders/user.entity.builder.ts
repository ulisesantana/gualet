import { generateRandomId } from './generate-random-id';
import { UserEntity } from '@src/users';

export function buildUserEntity({
  id = generateRandomId(),
  email = 'test@gualet.app',
  password = 'password123',
}: Partial<UserEntity> = {}): UserEntity {
  return {
    id,
    email,
    password,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as UserEntity;
}
