export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserRepository {
  register(credentials: UserCredentials): Promise<boolean>;

  login(credentials: UserCredentials): Promise<boolean>;

  logout(): Promise<boolean>;

  isLoggedIn(): Promise<boolean>;

  verify(): Promise<boolean>;
}
