import { Id } from '@src/common/domain';

export interface UserInput {
  id?: Id | string;
  email: string;
}

export class User {
  id: Id;

  email: string;

  constructor(user: UserInput) {
    this.id = new Id(user.id);
    this.email = user.email;
  }

  toJSON() {
    return {
      id: this.id.toString(),
      email: this.email,
    };
  }
}
