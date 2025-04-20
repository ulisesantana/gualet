import { beforeEach, describe, it, Mocked, vi } from "vitest";
import { UserRepository } from "@application/repositories";

import { LoginUseCase } from "./login.use-case";

describe("Login use case should", () => {
  let repository: Mocked<UserRepository>;
  let loginUseCase: LoginUseCase;

  beforeEach(() => {
    repository = {
      login: vi.fn().mockResolvedValue(true),
    } as unknown as Mocked<UserRepository>;
    loginUseCase = new LoginUseCase(repository);
  });

  it("logs the user in when valid credentials are provided", async () => {
    const input = { email: "user@example.com", password: "password123" };

    const result = await loginUseCase.exec(input);

    expect(result).toBe(true);
    expect(repository.login).toHaveBeenCalledWith(input);
  });

  it("throws an authentication error when credentials are invalid", async () => {
    const input = { email: "user@example.com", password: "password123" };

    // Simulate an authentication error
    repository.login.mockRejectedValue(new Error("Authentication failed"));

    const result = await loginUseCase.exec(input);

    expect(result).toBe(false);
    expect(repository.login).toHaveBeenCalledWith(input);
  });

  it("completes without errors when credentials are valid and login succeeds", async () => {
    const input = { email: "user@example.com", password: "password123" };

    await expect(loginUseCase.exec(input)).resolves.not.toThrow();
  });
});
