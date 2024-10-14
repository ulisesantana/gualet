import { describe, it, expect, vi } from "vitest";
import { Id } from "@domain/models";
import { v4 as uuid } from "uuid";

vi.mock("uuid", () => ({
  v4: vi.fn(),
}));

describe("Id", () => {
  it("should create a new Id with a generated UUID when no value is provided", () => {
    const mockUUID = "123e4567-e89b-12d3-a456-426614174000";
    (uuid as any).mockReturnValue(mockUUID);

    const id = new Id();

    expect(id.toString()).toBe(mockUUID);
  });

  it("should create a new Id with the provided value", () => {
    const value = "custom-id-value";
    const id = new Id(value);

    expect(id.toString()).toBe(value);
  });

  it("should compare two Ids", () => {
    const id1 = new Id("123");
    const id2 = new Id("123");

    expect(id1.equals(id2)).toBe(true);
  });

  it("should compare Id with given string", () => {
    const id = new Id("123");

    expect(id.equals("123")).toBe(true);
    expect(id.equals("456")).toBe(false);
  });
});
