import { describe, expect, it } from "vitest";

import { en } from "./en";
import { es } from "./es";

/**
 * Tests to verify translation consistency between languages
 */
describe("Translation Files", () => {
  describe("Structure Consistency", () => {
    it("should have the same top-level keys in English and Spanish", () => {
      const enKeys = Object.keys(en.translation);
      const esKeys = Object.keys(es.translation);

      expect(enKeys.sort()).toEqual(esKeys.sort());
    });

    it("should have the same common keys in both languages", () => {
      const enCommonKeys = Object.keys(en.translation.common);
      const esCommonKeys = Object.keys(es.translation.common);

      expect(enCommonKeys.sort()).toEqual(esCommonKeys.sort());
    });

    it("should have the same auth keys in both languages", () => {
      const enAuthKeys = Object.keys(en.translation.auth);
      const esAuthKeys = Object.keys(es.translation.auth);

      expect(enAuthKeys.sort()).toEqual(esAuthKeys.sort());
    });

    it("should have the same categories keys in both languages", () => {
      const enCategoriesKeys = Object.keys(en.translation.categories);
      const esCategoriesKeys = Object.keys(es.translation.categories);

      expect(enCategoriesKeys.sort()).toEqual(esCategoriesKeys.sort());
    });

    it("should have the same paymentMethods keys in both languages", () => {
      const enPaymentMethodsKeys = Object.keys(en.translation.paymentMethods);
      const esPaymentMethodsKeys = Object.keys(es.translation.paymentMethods);

      expect(enPaymentMethodsKeys.sort()).toEqual(esPaymentMethodsKeys.sort());
    });

    it("should have the same transactions keys in both languages", () => {
      const enTransactionsKeys = Object.keys(en.translation.transactions);
      const esTransactionsKeys = Object.keys(es.translation.transactions);

      expect(enTransactionsKeys.sort()).toEqual(esTransactionsKeys.sort());
    });

    it("should have the same reports keys in both languages", () => {
      const enReportsKeys = Object.keys(en.translation.reports);
      const esReportsKeys = Object.keys(es.translation.reports);

      expect(enReportsKeys.sort()).toEqual(esReportsKeys.sort());
    });

    it("should have the same settings keys in both languages", () => {
      const enSettingsKeys = Object.keys(en.translation.settings);
      const esSettingsKeys = Object.keys(es.translation.settings);

      expect(enSettingsKeys.sort()).toEqual(esSettingsKeys.sort());
    });
  });

  describe("Required Translations", () => {
    describe("Common", () => {
      it("should have all required common translations in English", () => {
        expect(en.translation.common.loading).toBeDefined();
        expect(en.translation.common.save).toBeDefined();
        expect(en.translation.common.cancel).toBeDefined();
        expect(en.translation.common.delete).toBeDefined();
        expect(en.translation.common.edit).toBeDefined();
        expect(en.translation.common.back).toBeDefined();
        expect(en.translation.common.search).toBeDefined();
        expect(en.translation.common.noResults).toBeDefined();
        expect(en.translation.common.error).toBeDefined();
        expect(en.translation.common.success).toBeDefined();
      });

      it("should have all required common translations in Spanish", () => {
        expect(es.translation.common.loading).toBeDefined();
        expect(es.translation.common.save).toBeDefined();
        expect(es.translation.common.cancel).toBeDefined();
        expect(es.translation.common.delete).toBeDefined();
        expect(es.translation.common.edit).toBeDefined();
        expect(es.translation.common.back).toBeDefined();
        expect(es.translation.common.search).toBeDefined();
        expect(es.translation.common.noResults).toBeDefined();
        expect(es.translation.common.error).toBeDefined();
        expect(es.translation.common.success).toBeDefined();
      });

      it("should have different values for English and Spanish common translations", () => {
        expect(en.translation.common.loading).not.toBe(
          es.translation.common.loading,
        );
        expect(en.translation.common.save).not.toBe(es.translation.common.save);
        expect(en.translation.common.cancel).not.toBe(
          es.translation.common.cancel,
        );
        expect(en.translation.common.delete).not.toBe(
          es.translation.common.delete,
        );
        expect(en.translation.common.edit).not.toBe(es.translation.common.edit);
      });
    });

    describe("Auth", () => {
      it("should have all required auth translations in English", () => {
        expect(en.translation.auth.login).toBeDefined();
        expect(en.translation.auth.logout).toBeDefined();
        expect(en.translation.auth.register).toBeDefined();
        expect(en.translation.auth.email).toBeDefined();
        expect(en.translation.auth.password).toBeDefined();
        expect(en.translation.auth.confirmPassword).toBeDefined();
        expect(en.translation.auth.username).toBeDefined();
        expect(en.translation.auth.loginError).toBeDefined();
        expect(en.translation.auth.registerSuccess).toBeDefined();
      });

      it("should have all required auth translations in Spanish", () => {
        expect(es.translation.auth.login).toBeDefined();
        expect(es.translation.auth.logout).toBeDefined();
        expect(es.translation.auth.register).toBeDefined();
        expect(es.translation.auth.email).toBeDefined();
        expect(es.translation.auth.password).toBeDefined();
        expect(es.translation.auth.confirmPassword).toBeDefined();
        expect(es.translation.auth.username).toBeDefined();
        expect(es.translation.auth.loginError).toBeDefined();
        expect(es.translation.auth.registerSuccess).toBeDefined();
      });

      it("should have different values for English and Spanish auth translations", () => {
        expect(en.translation.auth.login).not.toBe(es.translation.auth.login);
        expect(en.translation.auth.logout).not.toBe(es.translation.auth.logout);
        expect(en.translation.auth.register).not.toBe(
          es.translation.auth.register,
        );
        expect(en.translation.auth.email).not.toBe(es.translation.auth.email);
        expect(en.translation.auth.password).not.toBe(
          es.translation.auth.password,
        );
      });
    });

    describe("Categories", () => {
      it("should have all required categories translations in English", () => {
        expect(en.translation.categories.title).toBeDefined();
        expect(en.translation.categories.addCategory).toBeDefined();
        expect(en.translation.categories.manageCategories).toBeDefined();
        expect(en.translation.categories.categoryName).toBeDefined();
        expect(en.translation.categories.categoryType).toBeDefined();
        expect(en.translation.categories.income).toBeDefined();
        expect(en.translation.categories.outcome).toBeDefined();
        expect(en.translation.categories.noCategories).toBeDefined();
        expect(en.translation.categories.deleteConfirm).toBeDefined();
      });

      it("should have all required categories translations in Spanish", () => {
        expect(es.translation.categories.title).toBeDefined();
        expect(es.translation.categories.addCategory).toBeDefined();
        expect(es.translation.categories.manageCategories).toBeDefined();
        expect(es.translation.categories.categoryName).toBeDefined();
        expect(es.translation.categories.categoryType).toBeDefined();
        expect(es.translation.categories.income).toBeDefined();
        expect(es.translation.categories.outcome).toBeDefined();
        expect(es.translation.categories.noCategories).toBeDefined();
        expect(es.translation.categories.deleteConfirm).toBeDefined();
      });

      it("should have different values for English and Spanish categories translations", () => {
        expect(en.translation.categories.title).not.toBe(
          es.translation.categories.title,
        );
        expect(en.translation.categories.addCategory).not.toBe(
          es.translation.categories.addCategory,
        );
        expect(en.translation.categories.income).not.toBe(
          es.translation.categories.income,
        );
        expect(en.translation.categories.outcome).not.toBe(
          es.translation.categories.outcome,
        );
      });
    });

    describe("Settings", () => {
      it("should have all required settings translations in English", () => {
        expect(en.translation.settings.title).toBeDefined();
        expect(en.translation.settings.language).toBeDefined();
        expect(en.translation.settings.preferences).toBeDefined();
        expect(en.translation.settings.account).toBeDefined();
        expect(en.translation.settings.changeLanguage).toBeDefined();
        expect(en.translation.settings.english).toBeDefined();
        expect(en.translation.settings.spanish).toBeDefined();
      });

      it("should have all required settings translations in Spanish", () => {
        expect(es.translation.settings.title).toBeDefined();
        expect(es.translation.settings.language).toBeDefined();
        expect(es.translation.settings.preferences).toBeDefined();
        expect(es.translation.settings.account).toBeDefined();
        expect(es.translation.settings.changeLanguage).toBeDefined();
        expect(es.translation.settings.english).toBeDefined();
        expect(es.translation.settings.spanish).toBeDefined();
      });

      it("should have different values for English and Spanish settings translations", () => {
        expect(en.translation.settings.title).not.toBe(
          es.translation.settings.title,
        );
        expect(en.translation.settings.language).not.toBe(
          es.translation.settings.language,
        );
        expect(en.translation.settings.english).not.toBe(
          es.translation.settings.english,
        );
        expect(en.translation.settings.spanish).not.toBe(
          es.translation.settings.spanish,
        );
      });
    });
  });

  describe("Translation Values", () => {
    it("should not have empty string values in English translations", () => {
      const checkEmptyStrings = (obj: any, path = ""): string[] => {
        const empty: string[] = [];
        for (const key in obj) {
          const currentPath = path ? `${path}.${key}` : key;
          if (typeof obj[key] === "string") {
            if (obj[key].trim() === "") {
              empty.push(currentPath);
            }
          } else if (typeof obj[key] === "object") {
            empty.push(...checkEmptyStrings(obj[key], currentPath));
          }
        }
        return empty;
      };

      const emptyStrings = checkEmptyStrings(en.translation);
      expect(emptyStrings).toEqual([]);
    });

    it("should not have empty string values in Spanish translations", () => {
      const checkEmptyStrings = (obj: any, path = ""): string[] => {
        const empty: string[] = [];
        for (const key in obj) {
          const currentPath = path ? `${path}.${key}` : key;
          if (typeof obj[key] === "string") {
            if (obj[key].trim() === "") {
              empty.push(currentPath);
            }
          } else if (typeof obj[key] === "object") {
            empty.push(...checkEmptyStrings(obj[key], currentPath));
          }
        }
        return empty;
      };

      const emptyStrings = checkEmptyStrings(es.translation);
      expect(emptyStrings).toEqual([]);
    });

    it("should have proper English capitalization", () => {
      // Check some key translations for proper capitalization
      expect(en.translation.common.save).toBe("Save");
      expect(en.translation.common.cancel).toBe("Cancel");
      expect(en.translation.categories.title).toBe("Categories");
      expect(en.translation.settings.title).toBe("Settings");
    });

    it("should have proper Spanish capitalization", () => {
      // Check some key translations for proper capitalization
      expect(es.translation.common.save).toBe("Guardar");
      expect(es.translation.common.cancel).toBe("Cancelar");
      expect(es.translation.categories.title).toBe("Categorías");
      expect(es.translation.settings.title).toBe("Configuración");
    });
  });

  describe("Complete Coverage", () => {
    it("should have the exact number of categories in both languages", () => {
      const countKeys = (obj: any): number => {
        let count = 0;
        for (const key in obj) {
          if (typeof obj[key] === "object") {
            count += countKeys(obj[key]);
          } else {
            count++;
          }
        }
        return count;
      };

      const enCount = countKeys(en.translation);
      const esCount = countKeys(es.translation);

      expect(enCount).toBe(esCount);
      expect(enCount).toBeGreaterThan(0);
    });

    it("should have all main category sections", () => {
      const requiredSections = [
        "common",
        "auth",
        "categories",
        "paymentMethods",
        "transactions",
        "reports",
        "settings",
      ];

      requiredSections.forEach((section) => {
        expect(en.translation).toHaveProperty(section);
        expect(es.translation).toHaveProperty(section);
      });
    });
  });
});
