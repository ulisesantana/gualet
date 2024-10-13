import { UserPreferences } from "@domain/models";
import { UseCase } from "@application/cases/use-case";
import { UserPreferencesRepository } from "@application/repositories";

export class GetUserPreferencesUseCase
  implements UseCase<never, Promise<UserPreferences>>
{
  constructor(private readonly repository: UserPreferencesRepository) {}

  async exec(): Promise<UserPreferences> {
    return this.repository.find();
  }
}
