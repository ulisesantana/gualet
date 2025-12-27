import React, { useCallback, useEffect } from "react";
import "./CategoriesView.css";
import { Loader } from "@common/ui/components";
import {
  setUseCases,
  useCategoryStore,
} from "@categories/infrastructure/useCategoryStore";

import { CategoryList } from "../CategoryList/CategoryList";
import {
  DeleteCategoryUseCase,
  GetAllCategoriesUseCase,
} from "../../application/cases";

interface CategoriesViewProps {
  getAllCategoriesUseCase: GetAllCategoriesUseCase;
  deleteCategoryUseCase: DeleteCategoryUseCase;
}

export function CategoriesView({
  getAllCategoriesUseCase,
  deleteCategoryUseCase,
}: CategoriesViewProps) {
  // Use selectors to get only what we need from the store
  const categories = useCategoryStore((state) => state.categories);
  const isLoading = useCategoryStore((state) => state.isLoading);
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);
  const deleteCategory = useCategoryStore((state) => state.deleteCategory);

  // Inject use cases and load categories on mount
  useEffect(() => {
    setUseCases(getAllCategoriesUseCase, deleteCategoryUseCase);
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const handleDeleteCategory = useCallback(
    async (categoryId: string) => {
      try {
        await deleteCategory(categoryId);
      } catch (error) {
        // Error is already logged in the store
        // UI can show error message if needed
      }
    },
    [deleteCategory],
  );

  return (
    <div className="categories-view">
      {isLoading ? (
        <div className="loader-container">
          <Loader />
        </div>
      ) : (
        <CategoryList
          categories={categories}
          onDeleteCategory={handleDeleteCategory}
        />
      )}
    </div>
  );
}
