import React from "react";
import { Category, NewCategory, OperationType } from "@gualet/shared";

interface OnSubmitHandlerGeneratorParams {
  originalCategory?: Category;
  onSubmit: (category: Category | NewCategory) => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function generateOnSubmitHandler({
  onSubmit,
  originalCategory,
  onSuccess,
  onError,
}: OnSubmitHandlerGeneratorParams) {
  return (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const categoryData = {
      name: formData.get("name") as string,
      icon: formData.get("icon") as string,
      type: formData.get("type") as OperationType,
    };

    // Create NewCategory for new categories, Category for updates
    const category = originalCategory
      ? new Category({
          id: originalCategory.id,
          ...categoryData,
        })
      : new NewCategory(categoryData);

    onSubmit(category)
      .then(() => {
        if (!originalCategory) {
          form.reset();
        }
        onSuccess?.();
      })
      .catch((error) => {
        console.error("Error saving category:", error);
        onError?.(error);
      });
  };
}
