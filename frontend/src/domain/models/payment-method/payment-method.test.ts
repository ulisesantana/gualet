import { describe, expect, it } from "vitest";
import { Id, PaymentMethod } from "@domain/models";

describe("PaymentMethod", () => {
  it("should create a payment method with the correct properties", () => {
    const paymentMethod = new PaymentMethod({
      name: "Credit Card",
      icon: "💳",
    });

    expect(paymentMethod.id).toBeInstanceOf(Id);
    expect(paymentMethod.name).toBe("Credit Card");
    expect(paymentMethod.icon).toBe("💳");
    expect(paymentMethod.title).toBe("💳 Credit Card");
  });

  it("should create a payment method without an icon", () => {
    const paymentMethod = new PaymentMethod({
      name: "Cash",
    });

    expect(paymentMethod.icon).toBe("");
    expect(paymentMethod.title).toBe("Cash");
  });

  it("should use default icon if none is provided", () => {
    const paymentMethod = new PaymentMethod({
      name: "Cash",
    });
    expect(paymentMethod.title).toBe("Cash");
  });
});
