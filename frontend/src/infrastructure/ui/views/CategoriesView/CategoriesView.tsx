import React, { useEffect, useState } from "react";
import "./LastTransactionsView.css";
import { CategoryList } from "@components";
import { useLoader } from "@infrastructure/ui/hooks";
import { Category } from "@gualet/core";
import { GetAllCategoriesUseCase } from "@application/cases";

interface CategoriesViewProps {
  getAllCategoriesUseCase: GetAllCategoriesUseCase;
}

export function CategoriesView({
  getAllCategoriesUseCase,
}: CategoriesViewProps) {
  const { isLoading, setIsLoading, Loader } = useLoader();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setIsLoading(true);
    getAllCategoriesUseCase
      .exec()
      .then(setCategories)
      .catch((error) => {
        console.error("Error getting all categories.");
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [getAllCategoriesUseCase, setIsLoading]);

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
