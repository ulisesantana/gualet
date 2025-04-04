import { Required } from '@src/common/decorators';

export class LoginDto {
  @Required('test@gualet.app')
  email: string;

  @Required('1234')
  password: string;
}
