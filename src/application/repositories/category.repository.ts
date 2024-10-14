import { Id, Category } from "@domain/models";
import { Nullable } from "@domain/types";

export interface CategoryRepository {
  save(category: Category): Promise<void>;

  findById(id: Id): Promise<Nullable<Category>>;

  findAll(): Promise<Category[]>;
}
