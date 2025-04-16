export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserRepository {
  register(credentials: UserCredentials): Promise<void>;

  login(credentials: UserCredentials): Promise<void>;

  logout(): Promise<void>;

  isLoggedIn(): Promise<boolean>;
}
