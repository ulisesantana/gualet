import { User } from './user.model';

interface UserWithPasswordInput extends User {
  password: string;
}

export class UserWithPassword extends User {
  readonly password: string;
  constructor(user: UserWithPasswordInput) {
    super(user);
    this.password = user.password;
  }
}
