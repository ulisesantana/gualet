import React, { ChangeEvent, useEffect, useState } from "react";
import "./SettingsView.css";
import { Link } from "wouter";
import { routes } from "@infrastructure/ui/routes";
import { Loader, LogoutButton } from "@components";
import {
  defaultPaymentMethods,
  PaymentMethod,
  UserPreferences,
} from "@domain/models";
import {
  GetAllPaymentMethodsUseCase,
  GetUserPreferencesUseCase,
  SaveUserPreferencesUseCase,
} from "@application/cases";
import { useRepositories } from "@infrastructure/ui/hooks";

export function SettingsView() {
  const { isReady, repositories, isLoading, setIsLoading } = useRepositories();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    defaultPaymentMethod: defaultPaymentMethods[0],
  });

  useEffect(() => {
    if (isReady && repositories) {
      setIsLoading(true);
      new GetAllPaymentMethodsUseCase(repositories.paymentMethod)
        .exec()
        .then((methods) => {
          setPaymentMethods(methods);
          return new GetUserPreferencesUseCase(
            repositories.userPreferences,
          ).exec();
        })
        .then(setUserPreferences)
        .catch((error) => {
          console.error("Error getting data.");
          console.error(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isReady]);

  const onChangeDefaultPaymentMethod = (e: ChangeEvent<HTMLSelectElement>) => {
    const method = paymentMethods.find((m) => m.id.equals(e.target.value));
    if (repositories && method) {
      const preferences = { ...userPreferences, defaultPaymentMethod: method };
      new SaveUserPreferencesUseCase(repositories?.userPreferences)
        .exec(preferences)
        .then(() => {
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
        <label
          style={{ flexDirection: "column" }}
          htmlFor="default-payment-method"
        >
          Default payment method:
          <select
            name="default-payment-method"
            onChange={onChangeDefaultPaymentMethod}
            defaultValue={userPreferences.defaultPaymentMethod.id.toString()}
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
        <LogoutButton />
      </li>
    </ul>
  );
}
