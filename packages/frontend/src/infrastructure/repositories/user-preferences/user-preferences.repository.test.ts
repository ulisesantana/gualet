import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import { UserPreferences } from "@domain/models";
import { HttpDataSource } from "@infrastructure/data-sources";
import { UserPreferencesRepositoryImplementation } from "@infrastructure/repositories";
import { Id, PaymentMethod } from "@gualet/shared";

describe("UserPreferencesRepositoryImplementation", () => {
  let mockHttp: Mocked<HttpDataSource>;
  let userPreferencesRepository: UserPreferencesRepositoryImplementation;

  beforeEach(() => {
    mockHttp = {
      get: vi.fn(),
      put: vi.fn(),
    } as unknown as Mocked<HttpDataSource>;
    userPreferencesRepository = new UserPreferencesRepositoryImplementation(
      mockHttp as unknown as HttpDataSource,
    );
  });

  describe("save", () => {
    it("should save user preferences via HTTP", async () => {
      const preferences: UserPreferences = {
        defaultPaymentMethod: new PaymentMethod({
          id: new Id("pm-1"),
          name: "Credit Card",
          icon: "💳",
          color: "#343434",
        }),
      };

      mockHttp.put.mockResolvedValue({
        success: true,
        data: {
          preferences: {
            defaultPaymentMethod: {
              id: "pm-1",
              name: "Credit Card",
              icon: "💳",
              color: "#343434",
            },
          },
        },
      });

      await userPreferencesRepository.save(preferences);

      expect(mockHttp.put).toHaveBeenCalledWith("/api/me/preferences", {
        defaultPaymentMethodId: "pm-1",
      });
    });

    it("should throw an error if save fails", async () => {
      const preferences: UserPreferences = {
        defaultPaymentMethod: new PaymentMethod({
          id: new Id("pm-1"),
          name: "Credit Card",
          icon: "💳",
          color: "#343434",
        }),
      };

      mockHttp.put.mockResolvedValue({
        success: false,
        error: "Failed to save",
      });

      await expect(userPreferencesRepository.save(preferences)).rejects.toThrow(
        "Failed to save user preferences",
      );
    });
  });

  describe("find", () => {
    it("should retrieve user preferences from HTTP", async () => {
      mockHttp.get.mockResolvedValue({
        success: true,
        data: {
          preferences: {
            defaultPaymentMethod: {
              id: "pm-1",
              name: "Credit Card",
              icon: "💳",
              color: "#343434",
            },
          },
        },
      });

      const result = await userPreferencesRepository.find();

      expect(result).toEqual({
        defaultPaymentMethod: new PaymentMethod({
          id: new Id("pm-1"),
          name: "Credit Card",
          icon: "💳",
          color: "#343434",
        }),
      });
      expect(mockHttp.get).toHaveBeenCalledWith("/api/me/preferences");
    });

    it("should return null if fetch fails", async () => {
      mockHttp.get.mockResolvedValue({
        success: false,
        error: "Failed to fetch",
      });

      const result = await userPreferencesRepository.find();

      expect(result).toBeNull();
    });
  });
});
