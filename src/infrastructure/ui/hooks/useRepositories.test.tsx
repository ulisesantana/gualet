import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { useSession } from "@infrastructure/ui/contexts";
import { LocalStorageDataSource, supabase } from "@infrastructure/data-sources";
import {
  CategoryRepositoryImplementation,
  PaymentMethodRepositoryImplementation,
  TransactionRepositoryImplementation,
  UserPreferencesRepositoryImplementation,
} from "@infrastructure/repositories";

import { useRepositories } from "./useRepositories";

vi.mock("@infrastructure/ui/contexts", () => ({
  useSession: vi.fn(),
}));
vi.mock("@infrastructure/repositories", () => ({
  CategoryRepositoryImplementation: vi.fn(),
  PaymentMethodRepositoryImplementation: vi.fn(),
  TransactionRepositoryImplementation: vi.fn(),
  UserPreferencesRepositoryImplementation: vi.fn(),
}));

describe("useRepositories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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
      new LocalStorageDataSource("user"),
    );
  });

  it("should not initialize repositories when session is null", () => {
    (useSession as Mock).mockReturnValue({ session: null });

    const { result } = renderHook(() => useRepositories());

    expect(result.current.repositories).toBeNull();
    expect(result.current.isReady).toBe(false);
  });
});
