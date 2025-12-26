import { Category, NewCategory } from "@gualet/shared";
import { CategoryRepository } from "@application/repositories";
import { UseCase } from "@application/cases/use-case";

export class SaveCategoryUseCase
  implements UseCase<Category | NewCategory, Promise<void>>
{
  constructor(private readonly repository: CategoryRepository) {}

  async exec(category: Category | NewCategory): Promise<void> {
    // NewCategory doesn't have id, so we use create
    if (category instanceof NewCategory) {
      await this.repository.create(category as any);
    } else {
      // Category has id, so we use update
      await this.repository.update(category);
    }
  }
}
