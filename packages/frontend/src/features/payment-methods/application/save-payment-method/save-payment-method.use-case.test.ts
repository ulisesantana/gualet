import { beforeEach, describe, expect, it, vi } from "vitest";
import { PaymentMethodRepository } from "../payment-method.repository";
import { Id, PaymentMethod } from "@gualet/shared";

import { SavePaymentMethodUseCase } from "./save-payment-method.use-case";

const mockRepository: PaymentMethodRepository = {
  create: vi.fn(),
  update: vi.fn(),
  findById: vi.fn(),
  findAll: vi.fn(),
  delete: vi.fn(),
};

describe("SavePaymentMethodUseCase", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should save a payment method using the repository", async () => {
    const paymentMethod = new PaymentMethod({
      id: new Id("test-id"),
      name: "Credit Card",
      icon: "💳",
      color: "#FF5733",
    });

    const useCase = new SavePaymentMethodUseCase(mockRepository);

    await useCase.exec(paymentMethod);

    expect(mockRepository.update).toHaveBeenCalledWith(paymentMethod);
    expect(mockRepository.update).toHaveBeenCalledTimes(1);
  });
});
