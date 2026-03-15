import React from "react";

import { CategoryForm, CategoryFormParams } from "./CategoryForm";

export type AddCategoryFormProps = Pick<
  CategoryFormParams,
  "onSubmit" | "onSuccess" | "onError"
>;

export function AddCategoryForm(props: AddCategoryFormProps) {
  return <CategoryForm {...props} />;
}
