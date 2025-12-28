import { describe, expect, it } from "vitest";
import { act, renderHook } from "@test/test-utils";

import { useLoader } from "./useLoader";

describe("useLoader", () => {
  it("should initialize with isLoading as true", () => {
    const { result } = renderHook(() => useLoader());

    expect(result.current.isLoading).toBe(true);
  });

  it("should update isLoading when setIsLoading is called", () => {
    const { result } = renderHook(() => useLoader());

    expect(result.current.isLoading).toBe(true);

    act(() => {
      result.current.setIsLoading(false);
    });

    expect(result.current.isLoading).toBe(false);
  });

  it("should toggle isLoading state multiple times", () => {
    const { result } = renderHook(() => useLoader());

    act(() => {
      result.current.setIsLoading(false);
    });
    expect(result.current.isLoading).toBe(false);

    act(() => {
      result.current.setIsLoading(true);
    });
    expect(result.current.isLoading).toBe(true);

    act(() => {
      result.current.setIsLoading(false);
    });
    expect(result.current.isLoading).toBe(false);
  });

  it("should provide Loader component", () => {
    const { result } = renderHook(() => useLoader());

    expect(result.current.Loader).toBeDefined();
    expect(typeof result.current.Loader).toBe("function");
  });
});
