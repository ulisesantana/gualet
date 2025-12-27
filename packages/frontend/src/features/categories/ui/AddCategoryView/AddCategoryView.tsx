import React from "react";

import "./AddCategoryView.css";
import { Category, NewCategory } from "@gualet/shared";
import { routes } from "@common/infrastructure/routes";
import { useLocation, useRoute } from "wouter";
import { Transition } from "react-transition-group";
import { useCategoryStore } from "@categories/infrastructure/useCategoryStore";

import { SaveCategoryUseCase } from "../../application/cases";
import { AddCategoryForm } from "../CategoryForm/AddCategoryForm";

interface AddCategoryViewProps {
  saveCategoryUseCase: SaveCategoryUseCase;
}

export function AddCategoryView({ saveCategoryUseCase }: AddCategoryViewProps) {
  const [match] = useRoute(routes.categories.add);
  const [, setLocation] = useLocation();
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);

  const onSubmit = async (category: Category | NewCategory) => {
    await saveCategoryUseCase.exec(category);
  };

  const onSuccess = () => {
    // Refresh categories list after successful creation
    fetchCategories();
    // Redirect to categories list
    setLocation(routes.categories.list);
  };

  return (
    <Transition in={match} timeout={500}>
      <div className="category-details-view">
        <AddCategoryForm onSubmit={onSubmit} onSuccess={onSuccess} />
      </div>
    </Transition>
  );
}
