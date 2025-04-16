import { UserCredentials, UserRepository } from "@application/repositories";
import { HttpDataSource } from "@infrastructure/data-sources";
import { BaseResponse } from "@infrastructure/types";

export class UserRepositoryImplementation implements UserRepository {
  private readonly path = "/api/auth";

  constructor(private readonly http: HttpDataSource) {}

  async isLoggedIn(): Promise<boolean> {
    const result = await this.http.get<BaseResponse>(`${this.path}/verify`);
    return result.success;
  }

  async login(credentials: UserCredentials): Promise<void> {
    await this.http.post(`${this.path}/login`, credentials);
  }

  async logout(): Promise<void> {
    await this.http.post(`${this.path}/logout`);
  }

  async register(credentials: UserCredentials): Promise<void> {
    await this.http.post(`${this.path}/register`, credentials);
  }
}
