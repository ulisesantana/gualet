import { UserCredentials, UserRepository } from "@application/repositories";
import { HttpDataSource } from "@infrastructure/data-sources";
import { BaseResponse } from "@infrastructure/types";

export type UserResponse = BaseResponse<{
  user: {
    id: string;
    email: string;
  };
}>;

export class UserRepositoryImplementation implements UserRepository {
  private readonly path = "/api/auth";

  constructor(private readonly http: HttpDataSource) {}

  isLoggedIn() {
    return this.forwardSuccess(
      this.http.get<UserResponse>(`${this.path}/verify`),
    );
  }

  login(credentials: UserCredentials) {
    return this.forwardSuccess(
      this.http.post<UserCredentials, UserResponse>(
        `${this.path}/login`,
        credentials,
      ),
    );
  }

  logout() {
    return this.forwardSuccess(
      this.http.post<undefined, UserResponse>(`${this.path}/logout`),
    );
  }

  register(credentials: UserCredentials) {
    return this.forwardSuccess(
      this.http.post<UserCredentials, UserResponse>(
        `${this.path}/register`,
        credentials,
      ),
    );
  }

  verify() {
    return this.forwardSuccess(
      this.http.post<undefined, UserResponse>(`${this.path}/verify`),
    );
  }

  private async forwardSuccess(request: Promise<UserResponse>) {
    const result = await request;
    return result.success;
  }
}
