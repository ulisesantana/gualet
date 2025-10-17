import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import { UserRepository } from "@application/repositories";

import { LogoutUseCase } from "./logout.use-case";

describe("Logout use case should", () => {
  let logoutUseCase: LogoutUseCase;
  let mockUserRepository: Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      logout: vi.fn().mockResolvedValue({ success: true, error: null }),
    } as unknown as Mocked<UserRepository>;
    logoutUseCase = new LogoutUseCase(mockUserRepository);
  });

  it("log the user out", async () => {
    await logoutUseCase.exec();

    expect(mockUserRepository.logout).toHaveBeenCalled();
  });

  it("throw an error if signOut fails", async () => {
    mockUserRepository.logout.mockRejectedValue(new Error("Sign out failed"));

    await expect(logoutUseCase.exec()).rejects.toThrow("Sign out failed");
  });
});
