import { renderHook } from "@testing-library/react";
import { describe, expect, it, Mock, vi } from "vitest";
import { useSession } from "@infrastructure/ui/contexts";
import { supabase } from "@infrastructure/data-sources";
import {
  CategoryRepositoryImplementation,
  LocalStorageRepository,
  PaymentMethodRepositoryImplementation,
  TransactionRepositoryImplementation,
  UserPreferencesRepositoryImplementation,
} from "@infrastructure/repositories";

import { useRepositories } from "./useRepositories";

// Mock dependencies
vi.mock("@infrastructure/ui/contexts", () => ({
  useSession: vi.fn(),
}));
vi.mock("@infrastructure/data-sources", () => ({
  supabase: vi.fn(),
}));
vi.mock("@infrastructure/repositories", () => ({
  CategoryRepositoryImplementation: vi.fn(),
  PaymentMethodRepositoryImplementation: vi.fn(),
  TransactionRepositoryImplementation: vi.fn(),
  UserPreferencesRepositoryImplementation: vi.fn(),
  LocalStorageRepository: vi.fn(),
}));

describe("useRepositories", () => {
  it("should initialize repositories when session is available", () => {
    // Mock session
    const mockSession = {
      user: { id: "123" },
    };
    (useSession as Mock).mockReturnValue({ session: mockSession });

    const { result } = renderHook(() => useRepositories());

    expect(result.current.isReady).toBeTruthy();
    expect(result.current.repositories).not.toBeNull();
    expect(CategoryRepositoryImplementation).toHaveBeenCalledWith(
      "123",
      supabase,
    );
    expect(PaymentMethodRepositoryImplementation).toHaveBeenCalledWith(
      "123",
      supabase,
    );
    expect(TransactionRepositoryImplementation).toHaveBeenCalledWith(
      "123",
      supabase,
    );
    expect(UserPreferencesRepositoryImplementation).toHaveBeenCalledWith(
      new LocalStorageRepository("user"),
    );
  });

  it("should not initialize repositories when session is null", () => {
    (useSession as Mock).mockReturnValue({ session: null });

    const { result } = renderHook(() => useRepositories());

    expect(result.current.repositories).toBeNull();
    expect(result.current.isReady).toBe(false);
  });
});
