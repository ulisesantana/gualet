import { describe, expect, it, vi } from "vitest";
import {
  Category,
  Day,
  Id,
  OperationType,
  PaymentMethod,
  Transaction,
} from "@gualet/shared";

import { generateOnSubmitHandler } from "./submit-handler";

function makeCategory(name: string) {
  return new Category({ name, type: OperationType.Outcome });
}

function makePaymentMethod(name: string) {
  return new PaymentMethod({ name });
}

function makeTransaction() {
  return new Transaction({
    id: new Id("txn-1"),
    amount: 50,
    description: "Test",
    date: new Day("2024-01-01"),
    operation: OperationType.Outcome,
    category: makeCategory("Food"),
    paymentMethod: makePaymentMethod("Cash"),
  });
}

describe("generateOnSubmitHandler", () => {
  const categories = [makeCategory("Food"), makeCategory("Salary")];
  const paymentMethods = [makePaymentMethod("Cash"), makePaymentMethod("Card")];

  it("throws when category is not found", () => {
    const handler = generateOnSubmitHandler({
      categories,
      paymentMethods,
      onSubmit: vi.fn(),
    });

    const event = {
      preventDefault: vi.fn(),
      currentTarget: { reset: vi.fn() },
    } as unknown as React.FormEvent<HTMLFormElement>;

    const originalFormData = global.FormData;
    global.FormData = class {
      get(key: string) {
        if (key === "category") return "Unknown Category";
        if (key === "payment-method") return "Cash";
        return "";
      }
    } as any;

    expect(() => handler(event)).toThrow(
      "Category Unknown Category does not exist.",
    );
    global.FormData = originalFormData;
  });

  it("throws when payment method is not found", () => {
    const handler = generateOnSubmitHandler({
      categories,
      paymentMethods,
      onSubmit: vi.fn(),
    });

    const event = {
      preventDefault: vi.fn(),
      currentTarget: { reset: vi.fn() },
    } as unknown as React.FormEvent<HTMLFormElement>;

    const originalFormData = global.FormData;
    global.FormData = class {
      get(key: string) {
        if (key === "category") return "Food";
        if (key === "payment-method") return "Unknown Method";
        return "";
      }
    } as any;

    expect(() => handler(event)).toThrow(
      "Payment method Unknown Method does not exist.",
    );
    global.FormData = originalFormData;
  });

  it("uses originalTransaction category when categoryId is empty", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const originalTransaction = makeTransaction();

    const handler = generateOnSubmitHandler({
      categories,
      paymentMethods,
      onSubmit,
      originalTransaction,
    });

    const event = {
      preventDefault: vi.fn(),
      currentTarget: { reset: vi.fn() },
    } as unknown as React.FormEvent<HTMLFormElement>;

    const originalFormData = global.FormData;
    global.FormData = class {
      get(key: string) {
        if (key === "category") return "";
        if (key === "payment-method") return "Cash";
        if (key === "amount") return "100";
        if (key === "date") return "2024-01-01";
        if (key === "description") return "Updated";
        if (key === "operation") return OperationType.Outcome;
        return "";
      }
    } as any;

    handler(event);
    await vi.waitFor(() => expect(onSubmit).toHaveBeenCalled());

    const submitted = onSubmit.mock.calls[0][0] as Transaction;
    expect(submitted.category.name).toBe("Food");
    global.FormData = originalFormData;
  });
});

describe("generateOnSubmitHandler", () => {
  const categories = [makeCategory("Food"), makeCategory("Salary")];
  const paymentMethods = [makePaymentMethod("Cash"), makePaymentMethod("Card")];

  it("throws when category is not found", () => {
    const handler = generateOnSubmitHandler({
      categories,
      paymentMethods,
      onSubmit: vi.fn(),
    });

    const event = {
      preventDefault: vi.fn(),
      currentTarget: { reset: vi.fn() },
    } as unknown as React.FormEvent<HTMLFormElement>;

    // Simulate FormData returning unknown category
    const originalFormData = global.FormData;
    global.FormData = class {
      get(key: string) {
        if (key === "category") return "Unknown Category";
        if (key === "payment-method") return "Cash";
        return "";
      }
    } as any;

    expect(() => handler(event)).toThrow(
      "Category Unknown Category does not exist.",
    );
    global.FormData = originalFormData;
  });

  it("throws when payment method is not found", () => {
    const handler = generateOnSubmitHandler({
      categories,
      paymentMethods,
      onSubmit: vi.fn(),
    });

    const event = {
      preventDefault: vi.fn(),
      currentTarget: { reset: vi.fn() },
    } as unknown as React.FormEvent<HTMLFormElement>;

    const originalFormData = global.FormData;
    global.FormData = class {
      get(key: string) {
        if (key === "category") return "Food";
        if (key === "payment-method") return "Unknown Method";
        return "";
      }
    } as any;

    expect(() => handler(event)).toThrow(
      "Payment method Unknown Method does not exist.",
    );
    global.FormData = originalFormData;
  });

  it("uses originalTransaction category when categoryId is empty", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const originalTransaction = makeTransaction();

    const handler = generateOnSubmitHandler({
      categories,
      paymentMethods,
      onSubmit,
      originalTransaction,
    });

    const event = {
      preventDefault: vi.fn(),
      currentTarget: { reset: vi.fn() },
    } as unknown as React.FormEvent<HTMLFormElement>;

    const originalFormData = global.FormData;
    global.FormData = class {
      get(key: string) {
        if (key === "category") return ""; // empty — should use originalTransaction.category
        if (key === "payment-method") return "Cash";
        if (key === "amount") return "100";
        if (key === "date") return "2024-01-01";
        if (key === "description") return "Updated";
        if (key === "operation") return OperationType.Outcome;
        return "";
      }
    } as any;

    handler(event);
    await vi.waitFor(() => expect(onSubmit).toHaveBeenCalled());

    const submitted = onSubmit.mock.calls[0][0] as Transaction;
    expect(submitted.category.name).toBe("Food"); // from originalTransaction
    global.FormData = originalFormData;
  });
});
