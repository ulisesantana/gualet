import React from "react";
import "./AddCategoryView.css";
import { AddCategoryForm } from "@components";
import { Category } from "@domain/models";
import { SaveCategoryUseCase } from "@application/cases";
import { routes } from "@infrastructure/ui/routes";
import { useRoute } from "wouter";
import { Transition } from "react-transition-group";
import { useRepositories } from "@infrastructure/ui/hooks";

export function AddCategoryView() {
  const [match] = useRoute(routes.categories.add);
  const { repositories } = useRepositories();

  const onSubmit = async (category: Category) => {
    if (repositories) {
      await new SaveCategoryUseCase(repositories.category).exec(category);
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
