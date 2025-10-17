import { Category } from "@gualet/core";
import { CategoryRepository } from "@application/repositories";
import { UseCase } from "@application/cases/use-case";

export class GetAllCategoriesUseCase
  implements UseCase<never, Promise<Category[]>>
{
  constructor(private readonly repository: CategoryRepository) {}
  async exec(): Promise<Category[]> {
    return this.repository.findAll();
  }
}
