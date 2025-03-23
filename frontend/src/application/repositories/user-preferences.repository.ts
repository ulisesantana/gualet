import { UserPreferences } from "@domain/models";

export interface UserPreferencesRepository {
  find(): Promise<UserPreferences>;

  save(preferences: UserPreferences): Promise<void>;
}
