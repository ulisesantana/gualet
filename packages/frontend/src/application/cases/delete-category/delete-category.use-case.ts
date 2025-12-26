import { Id } from "@gualet/shared";
import { CategoryRepository } from "@application/repositories";
import { UseCase } from "@application/cases/use-case";

export class DeleteCategoryUseCase implements UseCase<Id, Promise<void>> {
  constructor(private readonly repository: CategoryRepository) {}

  async exec(id: Id): Promise<void> {
    await this.repository.delete(id);
  }
}
