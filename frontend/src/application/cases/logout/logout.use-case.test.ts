import { SupabaseClient } from "@supabase/supabase-js";
import { describe, it, beforeEach, expect } from "vitest";
import { MockSupabaseClient } from "@test/mocks";

import { LogoutUseCase } from "./logout.use-case";

describe("Logout use case should", () => {
  let logoutUseCase: LogoutUseCase;
  let mockSupabaseClient: MockSupabaseClient;

  beforeEach(() => {
    mockSupabaseClient = new MockSupabaseClient();
    logoutUseCase = new LogoutUseCase(
      mockSupabaseClient as unknown as SupabaseClient,
    );
  });

  it("log the user out", async () => {
    await logoutUseCase.exec();

    expect(mockSupabaseClient.auth.signOut).toHaveBeenCalled();
  });

  it("throw an error if signOut fails", async () => {
    mockSupabaseClient.auth.signOut.mockRejectedValue(
      new Error("Sign out failed"),
    );

    await expect(logoutUseCase.exec()).rejects.toThrow("Sign out failed");
  });
});
