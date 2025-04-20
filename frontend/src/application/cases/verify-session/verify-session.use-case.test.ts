import { UserRepository } from "@application/repositories";
import { beforeEach, describe, it, Mocked, vi } from "vitest";
import { VerifySessionUseCase } from "@application/cases";

describe("VerifySessionUseCase", () => {
  let verifySessionUseCase: VerifySessionUseCase;
  let userRepository: Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = {
      verify: vi.fn(),
    } as unknown as Mocked<UserRepository>;

    verifySessionUseCase = new VerifySessionUseCase(userRepository);
  });

  it("returns true when session is valid", async () => {
    userRepository.verify.mockResolvedValue(true);

    const result = await verifySessionUseCase.exec();

    expect(result).toBe(true);
    expect(userRepository.verify).toHaveBeenCalledTimes(1);
  });

  it("returns false when session is invalid", async () => {
    userRepository.verify.mockResolvedValue(false);

    const result = await verifySessionUseCase.exec();

    expect(result).toBe(false);
    expect(userRepository.verify).toHaveBeenCalledTimes(1);
  });

  it("returns false and logs error when repository throws exception", async () => {
    const error = new Error("Network error");
    userRepository.verify.mockRejectedValue(error);
    console.error = vi.fn();

    const result = await verifySessionUseCase.exec();

    expect(result).toBe(false);
    expect(userRepository.verify).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      "Error verifying session:",
      error,
    );
  });
});
