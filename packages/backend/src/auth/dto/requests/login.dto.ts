import { Required } from '@src/common/decorators';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'test@gualet.app',
  })
  @Required('test@gualet.app')
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'test1234',
  })
  @Required('1234')
  password: string;
}
