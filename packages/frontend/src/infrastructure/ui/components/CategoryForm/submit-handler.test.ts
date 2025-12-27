import { beforeEach, describe, expect, it, vi } from "vitest";
import { Category, Id, NewCategory, OperationType } from "@gualet/shared";

import { generateOnSubmitHandler } from "./submit-handler";

describe("generateOnSubmitHandler", () => {
  let mockForm: HTMLFormElement;

  beforeEach(() => {
    mockForm = document.createElement("form");
    mockForm.innerHTML = `
      <input name="name" value="Test Category" />
      <input name="icon" value="🛒" />
      <input name="type" value="Outcome" />
    `;
    mockForm.reset = vi.fn();
  });

  it("should create NewCategory when no originalCategory is provided", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const handler = generateOnSubmitHandler({ onSubmit });

    const event = new Event("submit", {
      bubbles: true,
      cancelable: true,
    }) as any;
    Object.defineProperty(event, "currentTarget", { value: mockForm });
    event.preventDefault = vi.fn();

    handler(event);

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(event.preventDefault).toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalledWith(expect.any(NewCategory));
    expect(mockForm.reset).toHaveBeenCalled();
  });

  it("should create Category when originalCategory is provided", async () => {
    const originalCategory = new Category({
      id: new Id("cat-1"),
      name: "Old Name",
      type: OperationType.Outcome,
      icon: "🏠",
      color: "#FF5733",
    });

    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const handler = generateOnSubmitHandler({ onSubmit, originalCategory });

    const event = new Event("submit", {
      bubbles: true,
      cancelable: true,
    }) as any;
    Object.defineProperty(event, "currentTarget", { value: mockForm });
    event.preventDefault = vi.fn();

    handler(event);

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(onSubmit).toHaveBeenCalled();
    expect(mockForm.reset).not.toHaveBeenCalled();
  });

  it("should call onSuccess when submission succeeds", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onSuccess = vi.fn();
    const handler = generateOnSubmitHandler({ onSubmit, onSuccess });

    const event = new Event("submit", {
      bubbles: true,
      cancelable: true,
    }) as any;
    Object.defineProperty(event, "currentTarget", { value: mockForm });
    event.preventDefault = vi.fn();

    handler(event);

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(onSuccess).toHaveBeenCalled();
  });

  it("should call onError when submission fails", async () => {
    const error = new Error("Submission failed");
    const onSubmit = vi.fn().mockRejectedValue(error);
    const onError = vi.fn();
    const handler = generateOnSubmitHandler({ onSubmit, onError });

    const event = new Event("submit", {
      bubbles: true,
      cancelable: true,
    }) as any;
    Object.defineProperty(event, "currentTarget", { value: mockForm });
    event.preventDefault = vi.fn();

    handler(event);

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(onError).toHaveBeenCalledWith(error);
  });

  it("should extract form data correctly", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const handler = generateOnSubmitHandler({ onSubmit });

    const event = new Event("submit", {
      bubbles: true,
      cancelable: true,
    }) as any;
    Object.defineProperty(event, "currentTarget", { value: mockForm });
    event.preventDefault = vi.fn();

    handler(event);

    await new Promise((resolve) => setTimeout(resolve, 10));

    const submittedCategory = onSubmit.mock.calls[0][0];
    expect(submittedCategory.name).toBe("Test Category");
    expect(submittedCategory.icon).toBe("🛒");
    expect(submittedCategory.type).toBe("Outcome");
  });

  it("should not throw if onSuccess is not provided", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const handler = generateOnSubmitHandler({ onSubmit });

    const event = new Event("submit", {
      bubbles: true,
      cancelable: true,
    }) as any;
    Object.defineProperty(event, "currentTarget", { value: mockForm });
    event.preventDefault = vi.fn();

    expect(() => handler(event)).not.toThrow();

    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(onSubmit).toHaveBeenCalled();
  });
});
