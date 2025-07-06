import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import { UserPreferences } from "@domain/models";
import { StorageDataSource } from "@infrastructure/data-sources";
import { UserPreferencesRepositoryImplementation } from "@infrastructure/repositories";
import { Id, PaymentMethod } from "@gualet/core";

describe("UserPreferencesRepositoryImplementation", () => {
  let mockLocalStorageDataSource: Mocked<StorageDataSource>;
  let userPreferencesRepository: UserPreferencesRepositoryImplementation;
  const dbName = "preferences";

  beforeEach(() => {
    mockLocalStorageDataSource = {
      set: vi.fn(),
      get: vi.fn(),
    } as unknown as Mocked<StorageDataSource>;
    userPreferencesRepository = new UserPreferencesRepositoryImplementation(
      mockLocalStorageDataSource,
    );
  });

  describe("save", () => {
    it("should save user preferences to local storage", async () => {
      const preferences: UserPreferences = {
        defaultPaymentMethod: new PaymentMethod({
          id: new Id("pm-1"),
          name: "Credit Card",
          icon: "💳",
        }),
      };

      await userPreferencesRepository.save(preferences);

      expect(mockLocalStorageDataSource.set).toHaveBeenCalledWith(
        dbName,
        preferences,
      );
    });
  });

  describe("find", () => {
    it("should retrieve user preferences from local storage if they exist", async () => {
      const storedPreferences = {
        defaultPaymentMethod: {
          id: { value: "pm-1" },
          name: "Credit Card",
          icon: "💳",
        },
      };
      mockLocalStorageDataSource.get.mockReturnValue(storedPreferences);

      const result = await userPreferencesRepository.find();

      expect(result).toEqual({
        defaultPaymentMethod: new PaymentMethod({
          id: new Id("pm-1"),
          name: "Credit Card",
          icon: "💳",
        }),
      });
    });
  });
});
