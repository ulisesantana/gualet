import { Category, Id } from "@domain/models";
import { Nullable } from "@domain/types";

export interface CategoryRepository {
  save(category: Category): Promise<Nullable<Category>>;

  findById(id: Id): Promise<Nullable<Category>>;

  findAll(): Promise<Category[]>;
}
