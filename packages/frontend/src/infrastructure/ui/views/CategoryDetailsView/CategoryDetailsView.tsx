import React, { useEffect, useState } from "react";
import "./CategoryDetailsView.css";
import { EditCategoryForm, Loader } from "@components";
import { GetCategoryUseCase, SaveCategoryUseCase } from "@application/cases";
import { routes } from "@infrastructure/ui/routes";
import { useRoute } from "wouter";
import { Transition } from "react-transition-group";
import { useLoader } from "@infrastructure/ui/hooks";
import { Category, Id } from "@gualet/shared";

interface CategoryDetailsViewProps {
  getCategoryUseCase: GetCategoryUseCase;
  saveCategoryUseCase: SaveCategoryUseCase;
}

export function CategoryDetailsView({
  getCategoryUseCase,
  saveCategoryUseCase,
}: CategoryDetailsViewProps) {
  const [match, params] = useRoute<{ id: string }>(routes.categories.details);
  const { isLoading, setIsLoading } = useLoader();
  const [category, setCategory] = useState<Category | undefined>();

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

  const onSubmit = async (category: Category) => {
    await saveCategoryUseCase.exec(category);
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
                <EditCategoryForm category={category} onSubmit={onSubmit} />
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
