import { Id, Category } from "@domain/models";
import { CategoryRepository } from "@application/repositories";
import { UseCase } from "@application/cases/use-case";

export class GetCategoryUseCase implements UseCase<Id, Promise<Category>> {
  constructor(private readonly repository: CategoryRepository) {}
  async exec(id: Id): Promise<Category> {
    return this.repository.findById(id);
  }
}
