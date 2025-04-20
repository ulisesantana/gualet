import { User, UserWithPassword } from '../index';
import { Id } from '@src/common/domain';
import { UserEntity } from '@src/db';

export class UserMapper {
  static toDomain(user: UserWithPassword | UserEntity): User {
    return new User({ ...user, id: new Id(user.id.toString()) });
  }

  static toUserWithPassword(entity: UserEntity): UserWithPassword {
    return new UserWithPassword({
      ...entity,
      id: new Id(entity.id),
    });
  }
}
