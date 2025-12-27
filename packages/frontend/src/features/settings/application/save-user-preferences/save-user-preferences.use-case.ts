import { UserPreferences } from "@domain/models";
import { UseCase } from "@common/application/use-case";

import { UserPreferencesRepository } from "../user-preferences.repository";

export class SaveUserPreferencesUseCase
  implements UseCase<UserPreferences, Promise<void>>
{
  constructor(private readonly repository: UserPreferencesRepository) {}

  exec(preferences: UserPreferences): Promise<void> {
    return this.repository.save(preferences);
  }
}
