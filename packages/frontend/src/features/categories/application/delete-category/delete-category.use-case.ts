import { Id } from "@gualet/shared";
import { CategoryRepository } from "../category.repository";
import { UseCase } from "@common/application/use-case";

export class DeleteCategoryUseCase implements UseCase<Id, Promise<void>> {
  constructor(private readonly repository: CategoryRepository) {}

  async exec(id: Id): Promise<void> {
    await this.repository.delete(id);
  }
}
