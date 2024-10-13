import React, { useEffect, useState } from "react";
import "./CategoryDetailsView.css";
import { EditCategoryForm, Loader } from "@components";
import { Category, Id } from "@domain/models";
import { GetCategoryUseCase, SaveCategoryUseCase } from "@application/cases";
import { routes } from "@infrastructure/ui/routes";
import { useRoute } from "wouter";
import { Transition } from "react-transition-group";
import { useRepositories } from "@infrastructure/ui/hooks";

export function CategoryDetailsView() {
  const [match, params] = useRoute(routes.categories.details);
  const { isReady, repositories, isLoading, setIsLoading } = useRepositories();
  const [category, setCategory] = useState<Category | undefined>();

  useEffect(() => {
    if (repositories) {
      new GetCategoryUseCase(repositories.category)
        // @ts-ignore
        .exec(new Id(params?.id))
        .then(setCategory)
        .catch((error) => {
          console.error("Error getting category");
          console.error(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isReady]);

  const onSubmit = async (category: Category) => {
    if (repositories) {
      await new SaveCategoryUseCase(repositories.category).exec(category);
    }
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
