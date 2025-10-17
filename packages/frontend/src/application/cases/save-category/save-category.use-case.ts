import { Category } from "@gualet/shared";
import { CategoryRepository } from "@application/repositories";
import { UseCase } from "@application/cases/use-case";

export class SaveCategoryUseCase implements UseCase<Category, Promise<void>> {
  constructor(private readonly repository: CategoryRepository) {}

  async exec(transaction: Category): Promise<void> {
    await this.repository.update(transaction);
  }
}
