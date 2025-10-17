import { Required } from '@src/common/decorators';

export class RegisterDto {
  @Required('test@gualet.app')
  email: string;

  @Required('1234')
  password: string;
}
