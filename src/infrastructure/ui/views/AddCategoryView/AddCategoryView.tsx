import React from "react";
import "./AddCategoryView.css";
import { AddCategoryForm } from "@components";
import { Category } from "@domain/models";
import { SaveCategoryUseCase } from "@application/cases";
import { routes } from "@infrastructure/ui/routes";
import { useRoute } from "wouter";
import { Transition } from "react-transition-group";
import { useCategories } from "@infrastructure/ui/hooks";

export function AddCategoryView() {
  const [match] = useRoute(routes.categories.add);
  const { repository } = useCategories();

  const onSubmit = async (category: Category) => {
    if (repository) {
      await new SaveCategoryUseCase(repository).exec(category);
    }
  };

  return (
    <Transition in={match} timeout={500}>
      <div className="category-details-view">
        <AddCategoryForm onSubmit={onSubmit} />
      </div>
    </Transition>
  );
}
