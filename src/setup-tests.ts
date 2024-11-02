// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import { vi } from "vitest";
import { MockSupabaseClient } from "@test/mocks";

vi.mock("@infrastructure/data-sources", () => ({
  supabase: new MockSupabaseClient(),
  LocalStorageDataSource: vi.fn(),
}));

console.log = () => {};
console.error = () => {};
