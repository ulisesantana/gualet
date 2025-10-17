import React from "react";
import ReactDOM from "react-dom/client";
import "./main.css";
import "./forms.css";
import "./theme.css";
import {
  GetLastTransactionsUseCase,
  GetTransactionConfigUseCase,
  GetUserPreferencesUseCase,
  LoginUseCase,
  LogoutUseCase,
  SaveTransactionUseCase,
  SignUpUseCase,
  VerifySessionUseCase,
} from "@application/cases";
import {
  TransactionRepositoryImplementation,
  UserPreferencesRepositoryImplementation,
  UserRepositoryImplementation,
} from "@infrastructure/repositories";
import {
  HttpDataSource,
  StorageDataSource,
  StorageType,
} from "@infrastructure/data-sources";

import { SettingsProvider } from "./contexts";
import { App } from "./App";

// DATA SOURCES
const http = new HttpDataSource();
const storage = new StorageDataSource("gualet", StorageType.Local);

// REPOSITORIES
const userRepository = new UserRepositoryImplementation(http);
const transactionRepository = new TransactionRepositoryImplementation(http);
const userPreferencesRepository = new UserPreferencesRepositoryImplementation(
  storage,
);

// USE CASES
const cases = {
  loginUseCase: new LoginUseCase(userRepository),
  signUpUseCase: new SignUpUseCase(userRepository),
  verifySessionUseCase: new VerifySessionUseCase(userRepository),
  logoutUseCase: new LogoutUseCase(userRepository),
  getLastTransactionsUseCase: new GetLastTransactionsUseCase(
    transactionRepository,
  ),
  getTransactionConfigUseCase: new GetTransactionConfigUseCase(
    transactionRepository,
  ),
  saveTransactionUseCase: new SaveTransactionUseCase(transactionRepository),
  getUserPreferencesUseCase: new GetUserPreferencesUseCase(
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
