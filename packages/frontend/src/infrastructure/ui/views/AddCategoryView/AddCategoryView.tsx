import React from "react";
import "./AddCategoryView.css";
import { AddCategoryForm } from "@components";
import { Category } from "@gualet/core";
import { SaveCategoryUseCase } from "@application/cases";
import { routes } from "@infrastructure/ui/routes";
import { useRoute } from "wouter";
import { Transition } from "react-transition-group";

interface AddCategoryViewProps {
  saveCategoryUseCase: SaveCategoryUseCase;
}

export function AddCategoryView({ saveCategoryUseCase }: AddCategoryViewProps) {
  const [match] = useRoute(routes.categories.add);

  const onSubmit = async (category: Category) => {
    await saveCategoryUseCase.exec(category);
  };

  return (
    <Transition in={match} timeout={500}>
      <div className="category-details-view">
        <AddCategoryForm onSubmit={onSubmit} />
      </div>
    </Transition>
  );
}
