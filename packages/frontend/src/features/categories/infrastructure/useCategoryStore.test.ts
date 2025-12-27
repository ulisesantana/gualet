import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { Category, Id, OperationType } from "@gualet/shared";

import {
  DeleteCategoryUseCase,
  GetAllCategoriesUseCase,
} from "../application/cases";
import { setUseCases, useCategoryStore } from "./useCategoryStore";

describe("useCategoryStore", () => {
  // Mock use cases
  const mockGetAllCategoriesUseCase = {
    exec: vi.fn(),
  } as unknown as GetAllCategoriesUseCase;

  const mockDeleteCategoryUseCase = {
    exec: vi.fn(),
  } as unknown as DeleteCategoryUseCase;

  // Test data
  const mockCategories: Category[] = [
    new Category({
      id: new Id("cat-1"),
      name: "Food",
      type: OperationType.Outcome,
      icon: "🍔",
      color: "#FF5733",
    }),
    new Category({
      id: new Id("cat-2"),
      name: "Salary",
      type: OperationType.Income,
      icon: "💰",
      color: "#33FF57",
    }),
  ];

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Reset store state first
    useCategoryStore.getState().reset();

    // Then inject use cases
    setUseCases(mockGetAllCategoriesUseCase, mockDeleteCategoryUseCase);
  });

  describe("Initial State", () => {
    it("should have empty categories initially", () => {
      const { result } = renderHook(() => useCategoryStore());

      expect(result.current.categories).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });

  describe("fetchCategories", () => {
    it("should fetch categories successfully", async () => {
      vi.mocked(mockGetAllCategoriesUseCase.exec).mockResolvedValue(
        mockCategories,
      );

      const { result } = renderHook(() => useCategoryStore());

      // Start fetching
      act(() => {
        result.current.fetchCategories();
      });

      // Should set loading state
      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBe(null);

      // Wait for async operation
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should have categories
      expect(result.current.categories).toEqual(mockCategories);
      expect(result.current.error).toBe(null);
      expect(mockGetAllCategoriesUseCase.exec).toHaveBeenCalledTimes(1);
    });

    it("should handle fetch error", async () => {
      const errorMessage = "Failed to fetch from server";
      vi.mocked(mockGetAllCategoriesUseCase.exec).mockRejectedValue(
        new Error(errorMessage),
      );

      const { result } = renderHook(() => useCategoryStore());

      // Start fetching
      act(() => {
        result.current.fetchCategories();
      });

      // Wait for async operation
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should set error
      expect(result.current.error).toBe(errorMessage);
      expect(result.current.categories).toEqual([]);
    });

    it("should handle non-Error exceptions", async () => {
      vi.mocked(mockGetAllCategoriesUseCase.exec).mockRejectedValue(
        "String error",
      );

      const { result } = renderHook(() => useCategoryStore());

      act(() => {
        result.current.fetchCategories();
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Failed to fetch categories");
    });

    it("should not fetch if use case is not set", async () => {
      // Create a new store without setting use cases
      setUseCases(undefined as any, mockDeleteCategoryUseCase);

      const { result } = renderHook(() => useCategoryStore());

      await act(async () => {
        await result.current.fetchCategories();
      });

      // Should not have called anything
      expect(result.current.categories).toEqual([]);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("deleteCategory", () => {
    beforeEach(() => {
      // Setup initial categories
      vi.mocked(mockGetAllCategoriesUseCase.exec).mockResolvedValue(
        mockCategories,
      );
    });

    it("should delete category successfully and refresh list", async () => {
      const categoryIdToDelete = "cat-1";
      const remainingCategories = mockCategories.filter(
        (cat) => cat.id.value !== categoryIdToDelete,
      );

      // Configure mocks for sequential calls
      vi.mocked(mockGetAllCategoriesUseCase.exec)
        .mockResolvedValueOnce(mockCategories) // First fetch
        .mockResolvedValueOnce(remainingCategories); // After delete

      vi.mocked(mockDeleteCategoryUseCase.exec).mockResolvedValue(undefined);

      const { result } = renderHook(() => useCategoryStore());

      // First fetch categories
      await act(async () => {
        await result.current.fetchCategories();
      });

      expect(result.current.categories).toHaveLength(2);

      // Delete category
      await act(async () => {
        await result.current.deleteCategory(categoryIdToDelete);
      });

      // Should have called delete use case
      expect(mockDeleteCategoryUseCase.exec).toHaveBeenCalledTimes(1);
      expect(mockDeleteCategoryUseCase.exec).toHaveBeenCalledWith(
        new Id(categoryIdToDelete),
      );

      // Should have refreshed the list
      expect(mockGetAllCategoriesUseCase.exec).toHaveBeenCalledTimes(2);
      expect(result.current.categories).toEqual(remainingCategories);
    });

    it("should handle delete error", async () => {
      const categoryIdToDelete = "cat-1";
      const errorMessage = "Category has transactions";

      vi.mocked(mockDeleteCategoryUseCase.exec).mockRejectedValue(
        new Error(errorMessage),
      );

      const { result } = renderHook(() => useCategoryStore());

      // Try to delete - should throw
      await expect(async () => {
        await result.current.deleteCategory(categoryIdToDelete);
      }).rejects.toThrow();

      // Check error directly from store state
      const storeState = useCategoryStore.getState();
      expect(storeState.error).toBe(errorMessage);
    });

    it("should handle non-Error exceptions during delete", async () => {
      vi.mocked(mockDeleteCategoryUseCase.exec).mockRejectedValue(
        "String error",
      );

      const { result } = renderHook(() => useCategoryStore());

      // Try to delete - should throw
      await expect(async () => {
        await result.current.deleteCategory("cat-1");
      }).rejects.toThrow();

      // Check error directly from store state
      const storeState = useCategoryStore.getState();
      expect(storeState.error).toBe("Failed to delete category");
    });

    it("should not delete if use case is not set", async () => {
      setUseCases(mockGetAllCategoriesUseCase, undefined as any);

      const { result } = renderHook(() => useCategoryStore());

      await act(async () => {
        await result.current.deleteCategory("cat-1");
      });

      // Should not have called anything
      expect(mockDeleteCategoryUseCase.exec).not.toHaveBeenCalled();
    });
  });

  describe("reset", () => {
    it("should reset store to initial state", async () => {
      vi.mocked(mockGetAllCategoriesUseCase.exec).mockResolvedValue(
        mockCategories,
      );

      const { result } = renderHook(() => useCategoryStore());

      // Fetch categories
      await act(async () => {
        await result.current.fetchCategories();
      });

      expect(result.current.categories).toHaveLength(2);

      // Reset
      act(() => {
        result.current.reset();
      });

      // Should be back to initial state
      expect(result.current.categories).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });

  describe("setUseCases", () => {
    it("should allow injecting use cases", () => {
      const newGetAllUseCase = {
        exec: vi.fn(),
      } as unknown as GetAllCategoriesUseCase;

      const newDeleteUseCase = {
        exec: vi.fn(),
      } as unknown as DeleteCategoryUseCase;

      // Should not throw
      expect(() => {
        setUseCases(newGetAllUseCase, newDeleteUseCase);
      }).not.toThrow();
    });
  });
});
