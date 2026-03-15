import { Id, Category } from "@gualet/shared";
import { CategoryRepository } from "../category.repository";
import { UseCase } from "@common/application/use-case";
import { CategoryNotFoundError } from "@common/domain/errors";

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
