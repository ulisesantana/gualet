import { SuccessResponse } from '@src/common/infrastructure';
import { User } from '@src/users';
import { ApiProperty } from '@nestjs/swagger';

interface Data {
  user: {
    id: string;
    email: string;
  };
}

export class UserResponseDto extends SuccessResponse<Data> {
  @ApiProperty({
    description: 'User data',
    example: {
      user: {
        id: 'cca72c21-a4e1-4845-8c6e-27b608e423ab',
        email: 'test@gualet.app',
      },
    },
  })
  declare data: Data;

  constructor(user: User) {
    super({ user: user.toJSON() });
  }
}
