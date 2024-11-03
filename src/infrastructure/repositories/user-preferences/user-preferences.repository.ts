import { UserPreferencesRepository } from "@application/repositories";
import {
  defaultUserPreferences,
  Id,
  PaymentMethod,
  UserPreferences,
} from "@domain/models";
import { StorageDataSource } from "@infrastructure/data-sources";

export class UserPreferencesRepositoryImplementation
  implements UserPreferencesRepository
{
  private readonly dbName = "preferences";

  constructor(private readonly ls: StorageDataSource) {}

  async save(preferences: UserPreferences): Promise<void> {
    this.ls.set(this.dbName, preferences);
  }

  async find(): Promise<UserPreferences> {
    const preferences = this.ls.get(this.dbName);
    if (!preferences) {
      return defaultUserPreferences;
    }
    return {
      defaultPaymentMethod: new PaymentMethod({
        ...preferences.defaultPaymentMethod,
        id: new Id(preferences.defaultPaymentMethod.id.value),
      }),
    };
  }
}
