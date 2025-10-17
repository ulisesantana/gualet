import { SuccessResponse } from '@src/common/infrastructure';
import { User } from '@src/users';

interface Data {
  user: {
    id: string;
    email: string;
  };
}

export class UserResponseDto extends SuccessResponse<Data> {
  constructor(user: User) {
    super({ user: user.toJSON() });
  }
}
