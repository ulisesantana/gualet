import { UserCredentials, UserRepository } from "@application/repositories";
import { HttpDataSource } from "@infrastructure/data-sources";
import { BaseResponse } from "@infrastructure/types";
import { CommandResponse } from "@domain/types";

export type UserResponse = BaseResponse<
  {
    user: {
      id: string;
      email: string;
    };
  },
  Error
>;

export class UserRepositoryImplementation implements UserRepository {
  private readonly path = "/api/auth";

  constructor(private readonly http: HttpDataSource) {}

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

  private async handleCommandResponse(
    request: Promise<UserResponse>,
  ): Promise<CommandResponse> {
    try {
      const { success, error } = await request;
      return success
        ? { success: true, reason: null }
        : { success: false, reason: error.message };
    } catch (error: any) {
      return {
        success: false,
        reason:
          error?.response?.data?.error?.message || "An unknown error occurred",
      };
    }
  }
}
