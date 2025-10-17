import { UserPreferences } from "@domain/models";
import { Nullable } from "@gualet/shared";

export interface UserPreferencesRepository {
  find(): Promise<Nullable<UserPreferences>>;

  save(preferences: UserPreferences): Promise<void>;
}
