import { describe, expect, it, vi } from "vitest";
import { GetUserPreferencesUseCase } from "../cases";
import { UserPreferencesRepository } from "../user-preferences.repository";
import { Id, PaymentMethod, UserPreferences } from "@domain/models";

const mockRepository: UserPreferencesRepository = {
  find: vi.fn(),
} as unknown as UserPreferencesRepository;

describe("GetUserPreferencesUseCase", () => {
  it("should return the user preferences with default payment method", async () => {
    const paymentMethod: PaymentMethod = new PaymentMethod({
      id: new Id("1"),
      name: "Credit card",
      icon: "💳",
    });
    const preferences: UserPreferences = {
      defaultPaymentMethod: paymentMethod,
    };

    mockRepository.find = vi.fn().mockResolvedValue(preferences);

    const result = await new GetUserPreferencesUseCase(mockRepository).exec();

    expect(result).toEqual(preferences);
    expect(mockRepository.find).toHaveBeenCalled();
  });
});
