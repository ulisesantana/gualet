import React from "react";
import { Route, Router } from "wouter";
// i18n
import "@common/infrastructure/i18n/config";
// Auth
import {
  LoginUseCase,
  LoginView,
  LogoutUseCase,
  ProtectedRoute,
  RegisterView,
  SignUpUseCase,
  VerifySessionUseCase,
} from "@auth";
// Categories
import {
  AddCategoryView,
  CategoriesView,
  CategoryDetailsView,
  DeleteCategoryUseCase,
  GetAllCategoriesUseCase,
  GetCategoryUseCase,
  SaveCategoryUseCase,
} from "@categories";
// Payment Methods
import {
  AddPaymentMethodView,
  DeletePaymentMethodUseCase,
  GetAllPaymentMethodsUseCase,
  GetPaymentMethodUseCase,
  PaymentMethodDetailsView,
  PaymentMethodsView,
  SavePaymentMethodUseCase,
} from "@payment-methods";
// Transactions
import {
  GetLastTransactionsUseCase,
  GetTransactionConfigUseCase,
  GetTransactionUseCase,
  LastTransactionsView,
  RemoveTransactionUseCase,
  SaveTransactionUseCase,
  TransactionDetailsView,
} from "@transactions";
// Reports
import { GetReportUseCase, ReportView } from "@reports";
// Settings
import {
  GetUserPreferencesUseCase,
  SaveUserPreferencesUseCase,
  SettingsView,
} from "@settings";
// Common
import { Header } from "@common/ui/components";

import { routes } from "../../infrastructure/routes";

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
    deleteCategoryUseCase: DeleteCategoryUseCase;
    getPaymentMethodUseCase: GetPaymentMethodUseCase;
    getAllPaymentMethodsUseCase: GetAllPaymentMethodsUseCase;
    savePaymentMethodUseCase: SavePaymentMethodUseCase;
    deletePaymentMethodUseCase: DeletePaymentMethodUseCase;
    getUserPreferencesUseCase: GetUserPreferencesUseCase;
    getReportUseCase: GetReportUseCase;
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
              getTransactionUseCase={cases.getTransactionUseCase}
              getTransactionConfigUseCase={cases.getTransactionConfigUseCase}
              saveTransactionUseCase={cases.saveTransactionUseCase}
              removeTransactionUseCase={cases.removeTransactionUseCase}
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
          {/*PAYMENT METHODS*/}
          <ProtectedRoute
            path={routes.paymentMethods.add}
            verifySessionUseCase={cases.verifySessionUseCase}
          >
            <AddPaymentMethodView {...cases} />
          </ProtectedRoute>
          <ProtectedRoute
            path={routes.paymentMethods.details}
            verifySessionUseCase={cases.verifySessionUseCase}
          >
            <PaymentMethodDetailsView {...cases} />
          </ProtectedRoute>
          <ProtectedRoute
            path={routes.paymentMethods.list}
            verifySessionUseCase={cases.verifySessionUseCase}
          >
            <PaymentMethodsView {...cases} />
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
