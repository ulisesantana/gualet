import React from "react";
import ReactDOM from "react-dom/client";
import "./main.css";
import "./forms.css";
import "./theme.css";
import {
  LoginUseCase,
  SignUpUseCase,
  VerifySessionUseCase,
} from "@application/cases";
import { UserRepositoryImplementation } from "@infrastructure/repositories";
import { HttpDataSource } from "@infrastructure/data-sources";

import { SettingsProvider } from "./contexts";
import { App } from "./App";

const http = new HttpDataSource();
const userRepository = new UserRepositoryImplementation(http);

const loginUseCase = new LoginUseCase(userRepository);
const signUpUseCase = new SignUpUseCase(userRepository);
const verifySessionUseCase = new VerifySessionUseCase(userRepository);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <SettingsProvider>
      <App cases={{ loginUseCase, signUpUseCase, verifySessionUseCase }} />
    </SettingsProvider>
  </React.StrictMode>,
);
