import { Category } from "@domain/models";
import { CategoryRepository } from "@application/repositories";

import { UseCase } from "./use-case";

export class SaveCategoryUseCase implements UseCase<Category, Promise<void>> {
  constructor(private readonly repository: CategoryRepository) {}

  exec(transaction: Category): Promise<void> {
    return this.repository.save(transaction);
  }
}
