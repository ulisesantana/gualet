import { SupabaseClient } from "@supabase/supabase-js";
import { beforeEach, describe, it } from "vitest";
import { MockSupabaseClient } from "@test/mocks";

import { LoginUseCase } from "./login.use-case";

describe("Login use case should", () => {
  let loginUseCase: LoginUseCase;
  let mockSupabaseClient: MockSupabaseClient;

  beforeEach(() => {
    mockSupabaseClient = new MockSupabaseClient();
    loginUseCase = new LoginUseCase(
      mockSupabaseClient as unknown as SupabaseClient,
    );
  });

  it("logs the user in when valid credentials are provided", async () => {
    const input = { email: "user@example.com", password: "password123" };

    await loginUseCase.exec(input);

    expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith(
      input,
    );
  });

  it("throws an authentication error when credentials are invalid", async () => {
    const input = { email: "user@example.com", password: "password123" };

    // Simulate an authentication error
    mockSupabaseClient.auth.signInWithPassword.mockRejectedValue(
      new Error("Authentication failed"),
    );

    await expect(loginUseCase.exec(input)).rejects.toThrow(
      "Authentication failed",
    );
  });
});
