import { describe, expect, it, vi } from "vitest";
import { GetPaymentMethodUseCase } from "../cases";
import { PaymentMethodRepository } from "../payment-method.repository";
import { Id, PaymentMethod } from "@gualet/shared";
import { PaymentMethodNotFoundError } from "@common/domain/errors";

describe("GetPaymentMethodUseCase", () => {
  it("should return a payment method when found", async () => {
    const mockPaymentMethod = new PaymentMethod({
      id: new Id("123"),
      name: "Credit Card",
      icon: "💳",
    });

    const mockRepository: PaymentMethodRepository = {
      findById: vi.fn().mockResolvedValue(mockPaymentMethod),
    } as unknown as PaymentMethodRepository;

    const result = await new GetPaymentMethodUseCase(mockRepository).exec(
      new Id("123"),
    );

    expect(result).toEqual(mockPaymentMethod);
    expect(mockRepository.findById).toHaveBeenCalledWith(new Id("123"));
  });

  it("should throw an error if payment method is not found", async () => {
    const mockRepository: PaymentMethodRepository = {
      findById: vi.fn().mockResolvedValue(null),
    } as unknown as PaymentMethodRepository;

    await expect(
      new GetPaymentMethodUseCase(mockRepository).exec(new Id("not-found")),
    ).rejects.toThrow(PaymentMethodNotFoundError);
  });
});
