import { UserCredentials, UserRepository } from "@application/repositories";
import { HttpDataSource } from "@infrastructure/data-sources";
import { BaseResponse } from "@infrastructure/types";
import { HttpRepository } from "@infrastructure/repositories/http.repository";

export type UserResponse = BaseResponse<
  {
    user: {
      id: string;
      email: string;
    };
  },
  Error
>;

export class UserRepositoryImplementation
  extends HttpRepository
  implements UserRepository
{
  private readonly path = "/api/auth";

  constructor(http: HttpDataSource) {
    super(http);
  }

  async isLoggedIn() {
    const result = await this.http.get<UserResponse>(`${this.path}/verify`);
    return result.success;
  }

  login(credentials: UserCredentials) {
    return this.handleCommandResponse(
      this.http.post<UserCredentials, UserResponse>(
        `${this.path}/login`,
        credentials,
      ),
    );
  }

  logout() {
    return this.handleCommandResponse(
      this.http.post<undefined, UserResponse>(`${this.path}/logout`),
    );
  }

  register(credentials: UserCredentials) {
    return this.handleCommandResponse(
      this.http.post<UserCredentials, UserResponse>(
        `${this.path}/register`,
        credentials,
      ),
    );
  }

  verify() {
    return this.handleCommandResponse(
      this.http.post<undefined, UserResponse>(`${this.path}/verify`),
    );
  }
}
