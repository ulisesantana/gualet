import { beforeEach, describe, expect, it, vi } from "vitest";

import { LoginDemoUseCase } from "./login-demo.use-case";
import { UserRepository } from "../user.repository";

describe("LoginDemoUseCase", () => {
  let loginDemoUseCase: LoginDemoUseCase;
  let repository: UserRepository;

  beforeEach(() => {
    repository = {
      loginDemo: vi.fn(),
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      isLoggedIn: vi.fn(),
      verify: vi.fn(),
    };
    loginDemoUseCase = new LoginDemoUseCase(repository);
  });

  it("should call repository loginDemo method", async () => {
    const expectedResponse = { success: true as const, error: null };
    vi.mocked(repository.loginDemo).mockResolvedValue(expectedResponse);

    const result = await loginDemoUseCase.exec();

    expect(repository.loginDemo).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedResponse);
  });

  it("should handle errors from repository", async () => {
    const error = { success: false as const, error: "Demo login failed" };
    vi.mocked(repository.loginDemo).mockResolvedValue(error);

    const result = await loginDemoUseCase.exec();

    expect(result).toEqual(error);
  });
});
