import React, { useEffect } from "react";
import { Route, Router, useLocation } from "wouter";
// i18n
import "@common/infrastructure/i18n/config";
// Auth
import {
  LoginDemoUseCase,
  LoginUseCase,
  LoginView,
  LogoutUseCase,
  ProtectedRoute,
  RegisterView,
  SignUpUseCase,
  VerifySessionUseCase,
} from "@auth";
import { useAuth } from "@auth/ui/AuthContext";
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
    loginDemoUseCase: LoginDemoUseCase;
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

/**
 * Verifies user session once on app startup.
 * This allows ProtectedRoute components to trust the isAuthenticated state
 * without re-verifying on every navigation.
 */
function SessionVerifier({
  verifySessionUseCase,
}: {
  verifySessionUseCase: VerifySessionUseCase;
}) {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Only verify once (when isAuthenticated is null = not yet verified)
    if (isAuthenticated !== null) return;

    verifySessionUseCase
      .exec()
      .then((result) => {
        setIsAuthenticated(result.success);
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // When we know user is not authenticated, redirect to login
    if (isAuthenticated !== false) return;
    const currentPath = window.location.pathname;
    const publicPaths = [routes.login, routes.register];
    const isPublicPath = publicPaths.some((p) => currentPath.endsWith(p));
    if (!isPublicPath) {
      setLocation(routes.login);
    }
  }, [isAuthenticated, setLocation]);

  return null;
}

export const App: React.FC<AppProps> = ({ cases }) => {
  return (
    // @ts-ignore
    <Router base={import.meta.env.BASE_URL}>
      <SessionVerifier verifySessionUseCase={cases.verifySessionUseCase} />
      <div className="App">
        <Header />
        <main className="App-main">
          {/*LOGIN*/}
          <Route path={routes.login}>
            <LoginView
              loginUseCase={cases.loginUseCase}
              loginDemoUseCase={cases.loginDemoUseCase}
            />
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
