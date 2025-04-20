import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import { SignUpUseCase } from "@application/cases";
import { UserRepository } from "@application/repositories"; // Import your custom mock

describe("Sign up use case", () => {
  let repository: Mocked<UserRepository>;
  let signUpUseCase: SignUpUseCase;

  beforeEach(() => {
    repository = {
      register: vi.fn().mockResolvedValue(true),
    } as unknown as Mocked<UserRepository>;
    signUpUseCase = new SignUpUseCase(repository);
  });

  it("should sign up a user with the provided credentials", async () => {
    const input = { email: "user@example.com", password: "password123" };

    const result = await signUpUseCase.exec(input);

    expect(result).toBe(true);
    expect(repository.register).toHaveBeenCalledWith(input);
  });

  it("should return false if server can't process the sign up", async () => {
    repository.register.mockResolvedValue(false);
    const input = { email: "user@example.com", password: "password123" };

    const result = await signUpUseCase.exec(input);

    expect(result).toBe(false);
    expect(repository.register).toHaveBeenCalledWith(input);
  });

  it("should return false sign up fails", async () => {
    const input = { email: "user@example.com", password: "password123" };

    // Simulate an error during sign up
    repository.register.mockRejectedValue(new Error("Sign up failed"));

    const result = await signUpUseCase.exec(input);

    expect(result).toBe(false);
  });
});
