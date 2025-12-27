import { Category } from "@gualet/shared";
import { CategoryRepository } from "../category.repository";
import { UseCase } from "@common/application/use-case";

export class GetAllCategoriesUseCase
  implements UseCase<never, Promise<Category[]>>
{
  constructor(private readonly repository: CategoryRepository) {}
  async exec(): Promise<Category[]> {
    return this.repository.findAll();
  }
}
