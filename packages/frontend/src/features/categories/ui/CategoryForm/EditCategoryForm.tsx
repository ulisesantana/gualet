import { CategoryForm, CategoryFormParams } from "./CategoryForm";

export type EditCategoryFormProps = Required<CategoryFormParams>;

export function EditCategoryForm(props: EditCategoryFormProps) {
  return <CategoryForm {...props} />;
}
