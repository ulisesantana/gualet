import { User, UserInput } from './user.model';

interface UserWithPasswordInput extends UserInput {
  password: string;
}

export class UserWithPassword extends User {
  readonly password: string;
  constructor(user: UserWithPasswordInput) {
    super(user);
    this.password = user.password;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      password: this.password,
    };
  }
}
