import React from "react";
import { CategoryForm, CategoryFormParams } from "@components";

export type AddCategoryFormProps = Pick<
  CategoryFormParams,
  "onSubmit" | "onSuccess"
>;

export function AddCategoryForm(props: AddCategoryFormProps) {
  return <CategoryForm {...props} />;
}
