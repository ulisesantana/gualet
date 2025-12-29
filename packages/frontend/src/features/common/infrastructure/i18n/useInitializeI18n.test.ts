import { beforeEach, describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";

import { useInitializeI18n } from "./useInitializeI18n";
import i18n from "./config";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("useInitializeI18n", () => {
  beforeEach(() => {
    localStorageMock.clear();
    i18n.changeLanguage("en");
  });

  it("should not change language if no language is provided", () => {
    renderHook(() => useInitializeI18n());
    expect(i18n.language).toBe("en");
  });

  it("should change language to Spanish when provided", () => {
    renderHook(() => useInitializeI18n("es"));
    expect(i18n.language).toBe("es");
  });

  it("should store language in localStorage", () => {
    renderHook(() => useInitializeI18n("es"));
    expect(localStorage.getItem("language")).toBe("es");
  });

  it("should change language to English when provided", () => {
    renderHook(() => useInitializeI18n("en"));
    expect(i18n.language).toBe("en");
    expect(localStorage.getItem("language")).toBe("en");
  });
});
