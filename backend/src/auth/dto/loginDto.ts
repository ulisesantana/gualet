import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'test@gualet.app' })
  email: string;

  @ApiProperty({ example: '1234' })
  password: string;
}
