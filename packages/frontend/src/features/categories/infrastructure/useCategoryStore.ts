import { create } from "zustand";
import { Category, Id } from "@gualet/shared";

import {
  DeleteCategoryUseCase,
  GetAllCategoriesUseCase,
} from "../application/cases";

interface CategoryStore {
  // State
  categories: Category[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCategories: () => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  reset: () => void;
}

// Use cases will be injected via setters
let getAllCategoriesUseCase: GetAllCategoriesUseCase;
let deleteCategoryUseCase: DeleteCategoryUseCase;

export const setUseCases = (
  getAllUseCase: GetAllCategoriesUseCase,
  deleteUseCase: DeleteCategoryUseCase,
) => {
  getAllCategoriesUseCase = getAllUseCase;
  deleteCategoryUseCase = deleteUseCase;
};

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  // Initial state
  categories: [],
  isLoading: false,
  error: null,

  // Fetch all categories
  fetchCategories: async () => {
    if (!getAllCategoriesUseCase) {
      console.error("getAllCategoriesUseCase not set");
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const categories = await getAllCategoriesUseCase.exec();
      set({ categories, isLoading: false });
    } catch (error) {
      console.error("Error fetching categories:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch categories",
        isLoading: false,
      });
    }
  },

  // Delete category and refresh list
  deleteCategory: async (categoryId: string) => {
    if (!deleteCategoryUseCase) {
      console.warn("deleteCategoryUseCase not set");
      return;
    }

    try {
      await deleteCategoryUseCase.exec(new Id(categoryId));
      // Auto-refresh after delete
      await get().fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to delete category",
      });
      throw error; // Re-throw so UI can handle it
    }
  },

  // Reset store (useful for testing)
  reset: () => set({ categories: [], isLoading: false, error: null }),
}));
