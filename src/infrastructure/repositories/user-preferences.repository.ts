import { UserPreferencesRepository } from "@application/repositories";
import {
  defaultPaymentMethods,
  defaultUserPreferences,
  Id,
  PaymentMethod,
  UserPreferences,
} from "@domain/models";
import { LocalStorageRepository } from "@infrastructure/repositories/localStorage.repository";

export class UserPreferencesRepositoryImplementation
  implements UserPreferencesRepository
{
  private readonly dbName = "preferences";

  constructor(private readonly ls: LocalStorageRepository) {}

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
