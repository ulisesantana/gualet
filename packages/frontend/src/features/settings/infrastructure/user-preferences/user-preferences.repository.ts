import { UserPreferences } from "@domain/models";
import { Id, Nullable, PaymentMethod } from "@gualet/shared";
import { BaseResponse } from "@infrastructure/types";
import { HttpDataSource, HttpRepository } from "@common/infrastructure";

import { UserPreferencesRepository } from "../../application/user-preferences.repository";

interface UserPreferencesDto {
  defaultPaymentMethod: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
  language: string;
}

type GetUserPreferencesResponse = BaseResponse<
  { preferences: UserPreferencesDto },
  Error
>;

type SaveUserPreferencesResponse = BaseResponse<
  { preferences: UserPreferencesDto },
  Error
>;

export class UserPreferencesRepositoryImplementation
  extends HttpRepository
  implements UserPreferencesRepository
{
  private readonly path = "/api/me/preferences";

  constructor(http: HttpDataSource) {
    super(http);
  }

  async find(): Promise<Nullable<UserPreferences>> {
    const { success, data, error } = await this.handleQueryResponse(
      this.http.get<GetUserPreferencesResponse>(this.path),
    );

    if (!success) {
      console.error("Error fetching user preferences:", error);
      return null;
    }

    return {
      defaultPaymentMethod: new PaymentMethod({
        id: new Id(data.preferences.defaultPaymentMethod.id),
        name: data.preferences.defaultPaymentMethod.name,
        icon: data.preferences.defaultPaymentMethod.icon,
        color: data.preferences.defaultPaymentMethod.color,
      }),
      language: (data.preferences.language || "en") as "en" | "es",
    };
  }

  async save(preferences: UserPreferences): Promise<void> {
    const { success, error } = await this.handleQueryResponse(
      this.http.put<
        { defaultPaymentMethodId: string; language?: string },
        SaveUserPreferencesResponse
      >(this.path, {
        defaultPaymentMethodId: preferences.defaultPaymentMethod.id.toString(),
        language: preferences.language,
      }),
    );

    if (!success) {
      console.error("Error saving user preferences:", error);
      throw new Error("Failed to save user preferences");
    }
  }
}
