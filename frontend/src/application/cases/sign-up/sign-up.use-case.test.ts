import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import { SignUpUseCase } from "@application/cases";
import { UserRepository } from "@application/repositories"; // Import your custom mock

describe("Sign up use case", () => {
  let repository: Mocked<UserRepository>;
  let signUpUseCase: SignUpUseCase;

  beforeEach(() => {
    repository = {
      register: vi.fn(),
    } as unknown as Mocked<UserRepository>;
    signUpUseCase = new SignUpUseCase(repository);
  });

  it("should sign up a user with the provided credentials", async () => {
    const input = { email: "user@example.com", password: "password123" };

    await signUpUseCase.exec(input);

    expect(repository.register).toHaveBeenCalledWith(input);
  });

  it("should throw an error if sign up fails", async () => {
    const input = { email: "user@example.com", password: "password123" };

    // Simulate an error during sign up
    repository.register.mockRejectedValue(new Error("Sign up failed"));

    await expect(signUpUseCase.exec(input)).rejects.toThrow("Sign up failed");
  });
});
