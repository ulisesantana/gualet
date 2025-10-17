import { Category, Id } from "@gualet/core";
import { Nullable } from "@domain/types";

export interface CategoryRepository {
  create(category: Category): Promise<Nullable<Category>>;

  update(category: Category): Promise<Nullable<Category>>;

  findById(id: Id): Promise<Nullable<Category>>;

  findAll(): Promise<Category[]>;
}
