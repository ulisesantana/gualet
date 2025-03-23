import { beforeEach, describe, expect, it } from "vitest";
import { SignUpUseCase } from "@application/cases";
import { SupabaseClient } from "@supabase/supabase-js";
import { MockSupabaseClient } from "@test/mocks"; // Import your custom mock

describe("Sign up use case", () => {
  let mockSupabaseClient: MockSupabaseClient;
  let signUpUseCase: SignUpUseCase;

  beforeEach(() => {
    mockSupabaseClient = new MockSupabaseClient();
    signUpUseCase = new SignUpUseCase(
      mockSupabaseClient as unknown as SupabaseClient,
    );
  });

  it("should sign up a user with the provided credentials", async () => {
    const input = { email: "user@example.com", password: "password123" };

    await signUpUseCase.exec(input);

    expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith(input);
  });

  it("should throw an error if sign up fails", async () => {
    const input = { email: "user@example.com", password: "password123" };

    // Simulate an error during sign up
    mockSupabaseClient.auth.signUp.mockRejectedValue(
      new Error("Sign up failed"),
    );

    await expect(signUpUseCase.exec(input)).rejects.toThrow("Sign up failed");
  });
});
