import { UserPreferences } from "@domain/models";
import { UseCase } from "@application/cases/use-case";
import { UserPreferencesRepository } from "@application/repositories";
import { Nullable } from "@gualet/shared";

export class GetUserPreferencesUseCase
  implements UseCase<never, Promise<Nullable<UserPreferences>>>
{
  constructor(private readonly repository: UserPreferencesRepository) {}

  async exec(): Promise<Nullable<UserPreferences>> {
    return this.repository.find();
  }
}
