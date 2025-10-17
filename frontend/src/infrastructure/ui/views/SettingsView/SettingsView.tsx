import React, { ChangeEvent, useEffect, useState } from "react";
import "./SettingsView.css";
import { Link } from "wouter";
import { routes } from "@infrastructure/ui/routes";
import { Loader, LogoutButton } from "@components";
import { UserPreferences } from "@domain/models";
import {
  GetAllPaymentMethodsUseCase,
  GetUserPreferencesUseCase,
  LogoutUseCase,
  SaveUserPreferencesUseCase,
} from "@application/cases";
import { useLoader } from "@infrastructure/ui/hooks";
import { Nullable, PaymentMethod } from "@gualet/core";

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
  const { isLoading, setIsLoading } = useLoader();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [userPreferences, setUserPreferences] =
    useState<Nullable<UserPreferences>>(null);

  useEffect(() => {
    setIsLoading(true);
    getAllPaymentMethodsUseCase
      .exec()
      .then((methods) => {
        setPaymentMethods(methods);
        return getUserPreferencesUseCase.exec();
      })
      .then(setUserPreferences)
      .catch((error) => {
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
        : { defaultPaymentMethod: method };
      saveUserPreferencesUseCase.exec(preferences).then(() => {
        setUserPreferences(preferences);
      });
    }
  };

  return isLoading ? (
    <div className="loader-container">
      <Loader />
    </div>
  ) : (
    <ul className="settings-view">
      <li>
        <Link to={routes.categories.add}>
          <button className="cta">Add a new category</button>
        </Link>
      </li>
      <li>
        <Link to={routes.categories.list}>
          <button className="cta">Manage categories</button>
        </Link>
      </li>
      <li>
        <Link to={routes.reports}>
          <button className="cta">Reports</button>
        </Link>
      </li>
      <li>
        <label
          style={{ flexDirection: "column" }}
          htmlFor="default-payment-method"
        >
          Default payment method:
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
      {/*<li>*/}
      {/*  <Link to={routes.paymentMethods.list}>*/}
      {/*    <button className="cta">Manage payment methods</button>*/}
      {/*  </Link>*/}
      {/*</li>*/}
      <li>
        <span>Logout</span>
        <LogoutButton logoutUseCase={logoutUseCase} />
      </li>
    </ul>
  );
}
