import { beforeEach, describe, expect, it, vi } from "vitest";
import { Id, NewPaymentMethod, PaymentMethod } from "@gualet/shared";

import { generateOnSubmitHandler } from "./submit-handler";

describe("generateOnSubmitHandler (PaymentMethod)", () => {
  let mockForm: HTMLFormElement;

  beforeEach(() => {
    mockForm = document.createElement("form");
    mockForm.innerHTML = `
      <input name="name" value="My Wallet" />
      <input name="icon" value="💰" />
      <input name="color" value="#123456" />
    `;
    mockForm.reset = vi.fn();
  });

  function createSubmitEvent(form: HTMLFormElement): Event & {
    preventDefault: ReturnType<typeof vi.fn>;
    currentTarget: HTMLFormElement;
  } {
    const event = new Event("submit", {
      bubbles: true,
      cancelable: true,
    }) as any;
    Object.defineProperty(event, "currentTarget", { value: form });
    event.preventDefault = vi.fn();
    return event;
  }

  it("should create NewPaymentMethod when no originalPaymentMethod is provided", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const handler = generateOnSubmitHandler({ onSubmit });

    const event = createSubmitEvent(mockForm);
    handler(event);

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(event.preventDefault).toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalledWith(expect.any(NewPaymentMethod));
    expect(mockForm.reset).toHaveBeenCalled();
  });

  it("should create PaymentMethod with existing id when originalPaymentMethod is provided", async () => {
    const originalPaymentMethod = new PaymentMethod({
      id: new Id("pm-1"),
      name: "Old Wallet",
      icon: "💳",
      color: "#000000",
    });

    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const handler = generateOnSubmitHandler({
      onSubmit,
      originalPaymentMethod,
    });

    const event = createSubmitEvent(mockForm);
    handler(event);

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(onSubmit).toHaveBeenCalledWith(expect.any(PaymentMethod));
    // Should NOT reset form when editing
    expect(mockForm.reset).not.toHaveBeenCalled();
  });

  it("should call onSuccess when submission succeeds", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onSuccess = vi.fn();
    const handler = generateOnSubmitHandler({ onSubmit, onSuccess });

    const event = createSubmitEvent(mockForm);
    handler(event);

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it("should call onError when submission fails", async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error("Server error"));
    const onError = vi.fn();
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const handler = generateOnSubmitHandler({ onSubmit, onError });

    const event = createSubmitEvent(mockForm);
    handler(event);

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(onError).toHaveBeenCalledWith(new Error("Server error"));
    consoleErrorSpy.mockRestore();
  });

  it("should call onError with generic message when non-Error is thrown", async () => {
    const onSubmit = vi.fn().mockRejectedValue("unexpected string error");
    const onError = vi.fn();
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const handler = generateOnSubmitHandler({ onSubmit, onError });

    const event = createSubmitEvent(mockForm);
    handler(event);

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(onError).toHaveBeenCalledWith(
      new Error("An unexpected error occurred"),
    );
    consoleErrorSpy.mockRestore();
  });

  it("should trim whitespace from name, icon and color fields", async () => {
    mockForm.innerHTML = `
      <input name="name" value="  Savings  " />
      <input name="icon" value="  💰  " />
      <input name="color" value="  #abc123  " />
    `;
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const handler = generateOnSubmitHandler({ onSubmit });

    const event = createSubmitEvent(mockForm);
    handler(event);

    await new Promise((resolve) => setTimeout(resolve, 10));

    const called = onSubmit.mock.calls[0][0] as NewPaymentMethod;
    expect(called.name).toBe("Savings");
    expect(called.icon).toBe("💰");
    expect(called.color).toBe("#abc123");
  });

  it("should work without onSuccess and onError callbacks", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const handler = generateOnSubmitHandler({ onSubmit });

    const event = createSubmitEvent(mockForm);

    await expect(() => handler(event)).not.toThrow();
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
