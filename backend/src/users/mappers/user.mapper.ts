import { User, UserWithPassword } from '../models';
import { UserEntity } from '../entities';

export class UserMapper {
  static toDomain(user: UserWithPassword | UserEntity): User {
    return new User(user);
  }

  static toUserWithPassword(entity: UserEntity): UserWithPassword {
    return new UserWithPassword(entity);
  }
}
