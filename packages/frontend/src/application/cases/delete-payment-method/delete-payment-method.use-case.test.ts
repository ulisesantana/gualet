import { beforeEach, describe, expect, it, vi } from "vitest";
import { PaymentMethodRepository } from "@application/repositories";
import { Id } from "@gualet/shared";

import { DeletePaymentMethodUseCase } from "./delete-payment-method.use-case";

const mockRepository: PaymentMethodRepository = {
  findAll: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};

describe("DeletePaymentMethodUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should delete a payment method", async () => {
    const paymentMethodId = new Id("test-id");
    const useCase = new DeletePaymentMethodUseCase(mockRepository);

    await useCase.exec(paymentMethodId);

    expect(mockRepository.delete).toHaveBeenCalledWith(paymentMethodId);
    expect(mockRepository.delete).toHaveBeenCalledTimes(1);
  });
});
