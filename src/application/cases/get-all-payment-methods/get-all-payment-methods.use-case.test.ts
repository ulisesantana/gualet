import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { PaymentMethodRepository } from "@application/repositories";
import { PaymentMethod } from "@domain/models";
import { GetAllPaymentMethodsUseCase } from "@application/cases";

// Mock repository
const mockPaymentMethodRepository: PaymentMethodRepository = {
  save: vi.fn(),
  findAll: vi.fn(),
  findById: vi.fn(),
};

describe("GetAllPaymentMethodsUseCase", () => {
  // Reset mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return all payment methods from the repository", async () => {
    const mockPaymentMethods: PaymentMethod[] = [
      new PaymentMethod({ name: "Credit card", icon: "💳" }),
      new PaymentMethod({ name: "Cash", icon: "💶" }),
    ];

    // Mock the repository return value
    (mockPaymentMethodRepository.findAll as Mock).mockResolvedValue(
      mockPaymentMethods,
    );

    const useCase = new GetAllPaymentMethodsUseCase(
      mockPaymentMethodRepository,
    );
    const paymentMethods = await useCase.exec();

    expect(paymentMethods).toEqual(mockPaymentMethods);
    expect(mockPaymentMethodRepository.findAll).toHaveBeenCalledTimes(1);
  });
});
