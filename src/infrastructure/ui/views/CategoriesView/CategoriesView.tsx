import React, { useEffect, useState } from "react";
import "./LastTransactionsView.css";
import { CategoryList, Loader } from "@components";
import { useCategories } from "@infrastructure/ui/hooks";
import { Category } from "@domain/models";
import { GetAllCategoriesUseCase } from "@application/cases";

export function CategoriesView() {
  const { isReady, repository } = useCategories();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isReady && repository) {
      setIsLoading(true);
      new GetAllCategoriesUseCase(repository)
        .exec()
        .then(setCategories)
        .catch((error) => {
          console.error("Error getting all categories.");
          console.error(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isReady]);

  return (
    <div className="categories-view">
      {isLoading ? (
        <div className="loader-container">
          <Loader />
        </div>
      ) : (
        <CategoryList categories={categories} />
      )}
    </div>
  );
}
