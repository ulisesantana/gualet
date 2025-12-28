import React from "react";
import ReactDOM from "react-dom/client";
import "./main.css";
import "./forms.css";
import "./theme.css";
// Auth
import {
  LoginUseCase,
  LogoutUseCase,
  SignUpUseCase,
  VerifySessionUseCase,
} from "@auth/application/cases";
import { UserRepositoryImplementation } from "@auth/infrastructure/user";
// Categories
import {
  DeleteCategoryUseCase,
  GetAllCategoriesUseCase,
  GetCategoryUseCase,
  SaveCategoryUseCase,
} from "@categories/application/cases";
import { CategoryRepositoryImplementation } from "@categories/infrastructure/category";
// Payment Methods
import {
  DeletePaymentMethodUseCase,
  GetAllPaymentMethodsUseCase,
  GetPaymentMethodUseCase,
  SavePaymentMethodUseCase,
} from "@payment-methods/application/cases";
import { PaymentMethodRepositoryImplementation } from "@payment-methods/infrastructure/payment-method";
// Transactions
import {
  GetLastTransactionsUseCase,
  GetTransactionConfigUseCase,
  GetTransactionUseCase,
  RemoveTransactionUseCase,
  SaveTransactionUseCase,
  TransactionRepositoryImplementation,
} from "@transactions";
// Reports
import { GetReportUseCase } from "@reports";
// Settings
import {
  GetUserPreferencesUseCase,
  SaveUserPreferencesUseCase,
  SettingsProvider,
  UserPreferencesRepositoryImplementation,
} from "@settings";
import { HttpDataSource } from "@common/infrastructure/http";

// Common
import { App, AppProps } from "./App";
import { ChakraProvider } from "./components";
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
    <ChakraProvider>
      <SettingsProvider>
        <App cases={cases} />
      </SettingsProvider>
    </ChakraProvider>
  </React.StrictMode>,
);
