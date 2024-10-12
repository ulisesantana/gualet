import { CategoryForm, CategoryFormParams } from "@components";

export type EditCategoryFormProps = Required<CategoryFormParams>;

export function EditCategoryForm(props: EditCategoryFormProps) {
  return <CategoryForm {...props} />;
}
