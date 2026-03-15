import React, { ChangeEvent, useEffect, useState } from "react";
import "./SettingsView.css";
import { Link } from "wouter";
import { routes } from "@common/infrastructure/routes";
import { Loader } from "@common/ui/components";
import { UserPreferences } from "@domain/models";
import { useLoader } from "@common/infrastructure/hooks";
import { Language, Nullable, PaymentMethod } from "@gualet/shared";
import { LogoutButton, LogoutUseCase } from "@auth";
import {
  GetUserPreferencesUseCase,
  SaveUserPreferencesUseCase,
} from "@settings";
import { GetAllPaymentMethodsUseCase } from "@payment-methods";
import { useTranslation } from "react-i18next";

interface SettingsViewProps {
  getAllPaymentMethodsUseCase: GetAllPaymentMethodsUseCase;
  getUserPreferencesUseCase: GetUserPreferencesUseCase;
  saveUserPreferencesUseCase: SaveUserPreferencesUseCase;
  logoutUseCase: LogoutUseCase;
}

export function SettingsView({
  getAllPaymentMethodsUseCase,
  getUserPreferencesUseCase,
  saveUserPreferencesUseCase,
  logoutUseCase,
}: SettingsViewProps) {
  const { t, i18n } = useTranslation();
  const { isLoading, setIsLoading } = useLoader();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [userPreferences, setUserPreferences] =
    useState<Nullable<UserPreferences>>(null);

  useEffect(() => {
    setIsLoading(true);
    getAllPaymentMethodsUseCase
      .exec()
      .then((methods: PaymentMethod[]) => {
        setPaymentMethods(methods);
        return getUserPreferencesUseCase.exec();
      })
      .then((preferences) => {
        setUserPreferences(preferences);
        // Set i18n language from user preferences
        if (preferences?.language) {
          i18n.changeLanguage(preferences.language);
        }
      })
      .catch((error: Error) => {
        console.error("Error getting data.");
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const onChangeDefaultPaymentMethod = (e: ChangeEvent<HTMLSelectElement>) => {
    const method = paymentMethods.find((m) => m.id.equals(e.target.value));
    if (method) {
      const preferences = userPreferences
        ? { ...userPreferences, defaultPaymentMethod: method }
        : { defaultPaymentMethod: method, language: "en" as Language };
      saveUserPreferencesUseCase.exec(preferences).then(() => {
        setUserPreferences(preferences);
      });
    }
  };

  const onChangeLanguage = (e: ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value as Language;
    const preferences = userPreferences
      ? { ...userPreferences, language: newLanguage }
      : {
          defaultPaymentMethod: paymentMethods[0],
          language: newLanguage,
        };

    saveUserPreferencesUseCase.exec(preferences).then(() => {
      setUserPreferences(preferences);
      i18n.changeLanguage(newLanguage);
      localStorage.setItem("language", newLanguage);
    });
  };

  return isLoading ? (
    <div className="loader-container">
      <Loader />
    </div>
  ) : (
    <ul className="settings-view">
      <li>
        <Link to={routes.categories.add}>
          <button className="cta">{t("categories.addCategory")}</button>
        </Link>
      </li>
      <li>
        <Link to={routes.categories.list}>
          <button className="cta">{t("categories.manageCategories")}</button>
        </Link>
      </li>
      <li>
        <Link to={routes.paymentMethods.add}>
          <button className="cta">
            {t("paymentMethods.addPaymentMethod")}
          </button>
        </Link>
      </li>
      <li>
        <Link to={routes.paymentMethods.list}>
          <button className="cta">
            {t("paymentMethods.managePaymentMethods")}
          </button>
        </Link>
      </li>
      <li>
        <Link to={routes.reports}>
          <button className="cta">{t("reports.title")}</button>
        </Link>
      </li>
      <li>
        <label
          style={{ flexDirection: "column" }}
          htmlFor="default-payment-method"
        >
          {t("paymentMethods.defaultPaymentMethod")}:
          <select
            name="default-payment-method"
            data-testid="select-default-payment-method"
            onChange={onChangeDefaultPaymentMethod}
            defaultValue={userPreferences?.defaultPaymentMethod.id.toString()}
          >
            {paymentMethods.map((p) => (
              <option key={p.id.toString()} value={p.id.toString()}>
                {p.title}
              </option>
            ))}
          </select>
        </label>
      </li>
      <li>
        <label style={{ flexDirection: "column" }} htmlFor="language">
          {t("settings.language")}:
          <select
            name="language"
            data-testid="select-language"
            onChange={onChangeLanguage}
            value={userPreferences?.language || "en"}
          >
            <option value="en">{t("settings.english")}</option>
            <option value="es">{t("settings.spanish")}</option>
          </select>
        </label>
      </li>
      <li>
        <span>{t("auth.logout")}</span>
        <LogoutButton logoutUseCase={logoutUseCase} />
      </li>
    </ul>
  );
}
