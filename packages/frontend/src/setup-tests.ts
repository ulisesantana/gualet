// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("@common/infrastructure", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@common/infrastructure")>();
  return {
    ...actual,
    StorageDataSource: vi.fn(),
  };
});

console.log = () => {};
console.error = () => {};
