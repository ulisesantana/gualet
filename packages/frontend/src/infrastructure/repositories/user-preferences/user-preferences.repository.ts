import { UserPreferencesRepository } from "@application/repositories";
import { StorageDataSource } from "@infrastructure/data-sources";
import { UserPreferences } from "@domain/models";
import { Id, Nullable, PaymentMethod } from "@gualet/core";

export class UserPreferencesRepositoryImplementation
  implements UserPreferencesRepository
{
  private readonly dbName = "preferences";

  constructor(private readonly ls: StorageDataSource) {}

  async find(): Promise<Nullable<UserPreferences>> {
    const preferences = this.ls.get(this.dbName);
    if (!preferences) {
      return null;
    }
    return {
      defaultPaymentMethod: new PaymentMethod({
        ...preferences.defaultPaymentMethod,
        id: new Id(preferences.defaultPaymentMethod.id.value),
      }),
    };
  }

  async save(preferences: UserPreferences): Promise<void> {
    this.ls.set(this.dbName, preferences);
  }
}
