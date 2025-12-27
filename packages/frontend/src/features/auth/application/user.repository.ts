import { CommandResponse } from "@common/domain/types";

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserRepository {
  register(credentials: UserCredentials): Promise<CommandResponse>;

  login(credentials: UserCredentials): Promise<CommandResponse>;

  logout(): Promise<CommandResponse>;

  isLoggedIn(): Promise<boolean>;

  verify(): Promise<CommandResponse>;
}
