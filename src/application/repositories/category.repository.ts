import { Id, Category } from "@domain/models";

export interface CategoryRepository {
  save(category: Category): Promise<void>;

  findById(id: Id): Promise<Category>;

  findAll(): Promise<Category[]>;
}
