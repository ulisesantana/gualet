import { UserPreferences } from "@domain/models";
import { UserPreferencesRepository } from "@application/repositories";

import { UseCase } from "./use-case";

export class SaveUserPreferencesUseCase
  implements UseCase<UserPreferences, Promise<void>>
{
  constructor(private readonly repository: UserPreferencesRepository) {}

  exec(preferences: UserPreferences): Promise<void> {
    return this.repository.save(preferences);
  }
}
