import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import { SaveUserPreferencesUseCase } from "@application/cases";
import { UserPreferencesRepository } from "@application/repositories";
import { defaultUserPreferences, UserPreferences } from "@domain/models";

describe("Save user preferences use case", () => {
  let mockUserPreferencesRepository: Mocked<UserPreferencesRepository>;
  let saveUserPreferencesUseCase: SaveUserPreferencesUseCase;

  beforeEach(() => {
    mockUserPreferencesRepository = {
      save: vi.fn(),
    } as unknown as Mocked<UserPreferencesRepository>;
    saveUserPreferencesUseCase = new SaveUserPreferencesUseCase(
      mockUserPreferencesRepository,
    );
  });

  it("should save user preferences", async () => {
    const preferences: UserPreferences = { ...defaultUserPreferences };

    await saveUserPreferencesUseCase.exec(preferences);

    expect(mockUserPreferencesRepository.save).toHaveBeenCalledWith(
      preferences,
    );
  });

  it("should throw an error if repository fails to save preferences", async () => {
    const preferences: UserPreferences = { ...defaultUserPreferences };

    // Simulate an error during save
    mockUserPreferencesRepository.save.mockRejectedValue(
      new Error("Failed to save preferences"),
    );

    await expect(saveUserPreferencesUseCase.exec(preferences)).rejects.toThrow(
      "Failed to save preferences",
    );
  });
});
