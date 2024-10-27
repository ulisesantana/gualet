import { Id, Category } from "@domain/models";
import { CategoryRepository } from "@application/repositories";
import { UseCase } from "@application/cases/use-case";
import { CategoryNotFoundError } from "@domain/errors";

export class GetCategoryUseCase implements UseCase<Id, Promise<Category>> {
  constructor(private readonly repository: CategoryRepository) {}
  async exec(id: Id): Promise<Category> {
    const category = await this.repository.findById(id);
    if (!category) {
      throw new CategoryNotFoundError(id);
    }
    return category;
  }
}
