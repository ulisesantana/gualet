import React, { useEffect, useState } from "react";
import "./LastTransactionsView.css";
import { CategoryList, Loader } from "@components";
import { useRepositories } from "@infrastructure/ui/hooks";
import { Category } from "@domain/models";
import { GetAllCategoriesUseCase } from "@application/cases";

export function CategoriesView() {
  const { isReady, repositories, isLoading, setIsLoading } = useRepositories();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (isReady && repositories) {
      setIsLoading(true);
      new GetAllCategoriesUseCase(repositories.category)
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
