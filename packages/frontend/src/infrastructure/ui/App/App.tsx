import React from "react";
import {
  AddCategoryView,
  CategoriesView,
  CategoryDetailsView,
  LastTransactionsView,
  LoginView,
  RegisterView,
  ReportView,
  SettingsView,
  TransactionDetailsView,
} from "@views";
import { Header, ProtectedRoute } from "@components";
import { Route, Router } from "wouter";
import { routes } from "@infrastructure/ui/routes";
import {
  GetAllCategoriesUseCase,
  GetAllPaymentMethodsUseCase,
  GetCategoryUseCase,
  GetLastTransactionsUseCase,
  GetReportUseCase,
  GetTransactionConfigUseCase,
  GetTransactionUseCase,
  GetUserPreferencesUseCase,
  LoginUseCase,
  LogoutUseCase,
  RemoveTransactionUseCase,
  SaveCategoryUseCase,
  SaveTransactionUseCase,
  SaveUserPreferencesUseCase,
  SignUpUseCase,
  VerifySessionUseCase,
} from "@application/cases";

export interface AppProps {
  cases: {
    loginUseCase: LoginUseCase;
    signUpUseCase: SignUpUseCase;
    verifySessionUseCase: VerifySessionUseCase;
    getLastTransactionsUseCase: GetLastTransactionsUseCase;
    getTransactionConfigUseCase: GetTransactionConfigUseCase;
    getTransactionUseCase: GetTransactionUseCase;
    saveTransactionUseCase: SaveTransactionUseCase;
    removeTransactionUseCase: RemoveTransactionUseCase;
    getCategoryUseCase: GetCategoryUseCase;
    getAllCategoriesUseCase: GetAllCategoriesUseCase;
    saveCategoryUseCase: SaveCategoryUseCase;
    getUserPreferencesUseCase: GetUserPreferencesUseCase;
    getReportUseCase: GetReportUseCase;
    getAllPaymentMethodsUseCase: GetAllPaymentMethodsUseCase;
    saveUserPreferencesUseCase: SaveUserPreferencesUseCase;
    logoutUseCase: LogoutUseCase;
  };
}

export const App: React.FC<AppProps> = ({ cases }) => {
  return (
    // @ts-ignore
    <Router base={import.meta.env.BASE_URL}>
      <div className="App">
        <Header />
        <main className="App-main">
          {/*LOGIN*/}
          <Route path={routes.login}>
            <LoginView loginUseCase={cases.loginUseCase} />
          </Route>
          {/*REGISTER*/}
          <Route path={routes.register}>
            <RegisterView signUpUseCase={cases.signUpUseCase} />
          </Route>
          <ProtectedRoute
            path={routes.home}
            verifySessionUseCase={cases.verifySessionUseCase}
          >
            <LastTransactionsView
              getLastTransactionsUseCase={cases.getLastTransactionsUseCase}
              getTransactionConfigUseCase={cases.getTransactionConfigUseCase}
              saveTransactionUseCase={cases.saveTransactionUseCase}
              getUserPreferencesUseCase={cases.getUserPreferencesUseCase}
            />
          </ProtectedRoute>
          {/*TRANSACTIONS*/}
          <ProtectedRoute
            path={routes.transactions.details}
            verifySessionUseCase={cases.verifySessionUseCase}
          >
            <TransactionDetailsView {...cases} />
          </ProtectedRoute>
          {/*CATEGORIES*/}
          <ProtectedRoute
            path={routes.categories.add}
            verifySessionUseCase={cases.verifySessionUseCase}
          >
            <AddCategoryView {...cases} />
          </ProtectedRoute>
          <ProtectedRoute
            path={routes.categories.details}
            verifySessionUseCase={cases.verifySessionUseCase}
          >
            <CategoryDetailsView {...cases} />
          </ProtectedRoute>
          <ProtectedRoute
            path={routes.categories.list}
            verifySessionUseCase={cases.verifySessionUseCase}
          >
            <CategoriesView {...cases} />
          </ProtectedRoute>
          {/*REPORTS*/}
          <ProtectedRoute
            path={routes.reports}
            verifySessionUseCase={cases.verifySessionUseCase}
          >
            <ReportView {...cases} />
          </ProtectedRoute>
          {/*SETTINGS*/}
          <ProtectedRoute
            path={routes.settings}
            verifySessionUseCase={cases.verifySessionUseCase}
          >
            <SettingsView {...cases} />
          </ProtectedRoute>
        </main>
      </div>
    </Router>
  );
};
