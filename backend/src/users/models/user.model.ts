interface UserInput {
  id: string;
  email: string;
}

export class User {
  id: string;

  email: string;

  constructor(user: UserInput) {
    this.id = user.id;
    this.email = user.email;
  }
}
