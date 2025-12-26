import React from "react";
import ReactDOM from "react-dom/client";
import "./main.css";
import "./forms.css";
import "./theme.css";
import {
  DeleteCategoryUseCase,
  DeletePaymentMethodUseCase,
  GetAllCategoriesUseCase,
  GetAllPaymentMethodsUseCase,
  GetCategoryUseCase,
  GetLastTransactionsUseCase,
  GetPaymentMethodUseCase,
  GetReportUseCase,
  GetTransactionConfigUseCase,
  GetTransactionUseCase,
  GetUserPreferencesUseCase,
  LoginUseCase,
  LogoutUseCase,
  RemoveTransactionUseCase,
  SaveCategoryUseCase,
  SavePaymentMethodUseCase,
  SaveTransactionUseCase,
  SaveUserPreferencesUseCase,
  SignUpUseCase,
  VerifySessionUseCase,
} from "@application/cases";
import {
  CategoryRepositoryImplementation,
  PaymentMethodRepositoryImplementation,
  TransactionRepositoryImplementation,
  UserPreferencesRepositoryImplementation,
  UserRepositoryImplementation,
} from "@infrastructure/repositories";
import { HttpDataSource } from "@infrastructure/data-sources";

import { SettingsProvider } from "./contexts";
import { App, AppProps } from "./App";

// DATA SOURCES
const http = new HttpDataSource();

// REPOSITORIES
const userRepository = new UserRepositoryImplementation(http);
const transactionRepository = new TransactionRepositoryImplementation(http);
const categoryRepository = new CategoryRepositoryImplementation(http);
const paymentMethodRepository = new PaymentMethodRepositoryImplementation(http);
const userPreferencesRepository = new UserPreferencesRepositoryImplementation(
  http,
);

// USE CASES
const cases: AppProps["cases"] = {
  loginUseCase: new LoginUseCase(userRepository),
  signUpUseCase: new SignUpUseCase(userRepository),
  verifySessionUseCase: new VerifySessionUseCase(userRepository),
  logoutUseCase: new LogoutUseCase(userRepository),
  getTransactionUseCase: new GetTransactionUseCase(transactionRepository),
  getLastTransactionsUseCase: new GetLastTransactionsUseCase(
    transactionRepository,
  ),
  saveTransactionUseCase: new SaveTransactionUseCase(transactionRepository),
  removeTransactionUseCase: new RemoveTransactionUseCase(transactionRepository),
  getTransactionConfigUseCase: new GetTransactionConfigUseCase(
    transactionRepository,
  ),
  getUserPreferencesUseCase: new GetUserPreferencesUseCase(
    userPreferencesRepository,
  ),
  getAllCategoriesUseCase: new GetAllCategoriesUseCase(categoryRepository),
  getCategoryUseCase: new GetCategoryUseCase(categoryRepository),
  saveCategoryUseCase: new SaveCategoryUseCase(categoryRepository),
  deleteCategoryUseCase: new DeleteCategoryUseCase(categoryRepository),
  getAllPaymentMethodsUseCase: new GetAllPaymentMethodsUseCase(
    paymentMethodRepository,
  ),
  getPaymentMethodUseCase: new GetPaymentMethodUseCase(paymentMethodRepository),
  savePaymentMethodUseCase: new SavePaymentMethodUseCase(
    paymentMethodRepository,
  ),
  deletePaymentMethodUseCase: new DeletePaymentMethodUseCase(
    paymentMethodRepository,
  ),
  getReportUseCase: new GetReportUseCase(transactionRepository),
  saveUserPreferencesUseCase: new SaveUserPreferencesUseCase(
    userPreferencesRepository,
  ),
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <SettingsProvider>
      <App cases={cases} />
    </SettingsProvider>
  </React.StrictMode>,
);
