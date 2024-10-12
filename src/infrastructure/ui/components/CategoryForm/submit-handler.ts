import { Category, TransactionOperation } from "@domain/models";
import React from "react";

interface OnSubmitHandlerGeneratorParams {
  originalCategory?: Category;
  onSubmit: (transaction: Category) => Promise<void>;
}

export function generateOnSubmitHandler({
  onSubmit,
  originalCategory,
}: OnSubmitHandlerGeneratorParams) {
  return (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const category = new Category({
      id: originalCategory?.id,
      name: formData.get("name") as string,
      icon: formData.get("icon") as string,
      type: formData.get("type") as TransactionOperation,
    });

    onSubmit(category).then(() => {
      if (!originalCategory) {
        form.reset();
      }
    });
  };
}
