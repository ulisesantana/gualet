import { Category, Id, NewCategory } from "@gualet/shared";
import { Nullable } from "@domain/types";

export interface CategoryRepository {
  create(category: NewCategory): Promise<Nullable<Category>>;

  update(category: Category): Promise<Nullable<Category>>;

  findById(id: Id): Promise<Nullable<Category>>;

  findAll(): Promise<Category[]>;

  delete(id: Id): Promise<void>;
}
