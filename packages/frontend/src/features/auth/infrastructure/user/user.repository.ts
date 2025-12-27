import { UserCredentials, UserRepository } from "../../application/user.repository";
import { HttpDataSource } from "@common/infrastructure";
import { BaseResponse } from "@infrastructure/types";
import { HttpRepository } from "@common/infrastructure/http.repository";

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
    try {
      const result = await this.http.post<undefined, UserResponse>(
        `${this.path}/verify`,
      );
      return result.success;
    } catch (_error) {
      // If verify fails (401, etc), user is not logged in
      return false;
    }
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
