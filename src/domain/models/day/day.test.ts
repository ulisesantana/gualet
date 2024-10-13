import { describe, it, expect } from "vitest";
import { Day } from "@domain/models";

describe("Day", () => {
  it("should initialize with the current date if no date is provided", () => {
    const day = new Day();
    const today = new Date();
    expect(day.getYear()).toBe(today.getUTCFullYear());
    expect(day.getMonth()).toBe(today.getUTCMonth() + 1);
    expect(day.getDate()).toBe(today.getUTCDate());
  });

  it("should correctly parse and return year, month, and date from a string", () => {
    const day = new Day("2023-10-10");
    expect(day.getYear()).toBe(2023);
    expect(day.getMonth()).toBe(10);
    expect(day.getDate()).toBe(10);
  });

  it("should return formatted date as a string", () => {
    const day = new Day("2023-10-01");
    expect(day.toString("/")).toBe("2023/10/01");
  });

  it("should pad day and month values correctly", () => {
    const day = new Day("2023-1-5");
    expect(day.toString("-")).toBe("2023-01-05");
  });
});
