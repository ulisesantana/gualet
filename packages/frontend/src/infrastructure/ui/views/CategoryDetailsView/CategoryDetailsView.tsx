import React, { useEffect, useState } from "react";
import "./CategoryDetailsView.css";
import { EditCategoryForm, Loader } from "@components";
import { GetCategoryUseCase, SaveCategoryUseCase } from "@application/cases";
import { routes } from "@infrastructure/ui/routes";
import { useLocation, useRoute } from "wouter";
import { Transition } from "react-transition-group";
import { useLoader } from "@infrastructure/ui/hooks";
import { Category, Id, NewCategory } from "@gualet/shared";
import { useCategoryStore } from "@infrastructure/ui/stores/useCategoryStore";

interface CategoryDetailsViewProps {
  getCategoryUseCase: GetCategoryUseCase;
  saveCategoryUseCase: SaveCategoryUseCase;
}

export function CategoryDetailsView({
  getCategoryUseCase,
  saveCategoryUseCase,
}: CategoryDetailsViewProps) {
  const [match, params] = useRoute<{ id: string }>(routes.categories.details);
  const [, setLocation] = useLocation();
  const { isLoading, setIsLoading } = useLoader();
  const [category, setCategory] = useState<Category | undefined>();
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);

  useEffect(() => {
    if (params) {
      getCategoryUseCase
        .exec(new Id(params.id))
        .then(setCategory)
        .catch((error) => {
          console.error("Error getting category");
          console.error(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [params]);

  const onSubmit = async (category: Category | NewCategory) => {
    await saveCategoryUseCase.exec(category);
  };

  const onSuccess = () => {
    // Refresh categories list after successful update
    fetchCategories();
    // Redirect to categories list
    setLocation(routes.categories.list);
  };

  return (
    <Transition in={match} timeout={500}>
      <div className="category-details-view">
        {isLoading ? (
          <div className="loader-container">
            <Loader />
          </div>
        ) : (
          <div className="content">
            {category ? (
              <>
                <EditCategoryForm
                  category={category}
                  onSubmit={onSubmit}
                  onSuccess={onSuccess}
                  onError={(error) =>
                    console.error("Error updating category:", error)
                  }
                />
              </>
            ) : (
              <h2>Category not found.</h2>
            )}
          </div>
        )}
      </div>
    </Transition>
  );
}
