import React from "react";
import { LastTransactionsView, LoginView } from "@views";
import { Header, ProtectedRoute } from "@components";
import { Route, Router } from "wouter";
import { routes } from "@infrastructure/ui/routes";
import {
  LoginUseCase,
  SignUpUseCase,
  VerifySessionUseCase,
} from "@application/cases";

export interface AppProps {
  cases: {
    loginUseCase: LoginUseCase;
    signUpUseCase: SignUpUseCase;
    verifySessionUseCase: VerifySessionUseCase;
  };
}

export const App: React.FC<AppProps> = ({
  cases: { loginUseCase, signUpUseCase, verifySessionUseCase },
}) => {
  return (
    // @ts-ignore
    <Router base={import.meta.env.BASE_URL}>
      <div className="App">
        <Header />
        <main className="App-main">
          <ProtectedRoute
            path={routes.root}
            verifySessionUseCase={verifySessionUseCase}
          >
            <LastTransactionsView />
          </ProtectedRoute>
          {/*/!*TRANSACTIONS*!/*/}
          {/*<ProtectedRoute*/}
          {/*  path={routes.transactions.details}*/}
          {/*  verifySessionUseCase={verifySessionUseCase}*/}
          {/*>*/}
          {/*  <TransactionDetailsView />*/}
          {/*</ProtectedRoute>*/}
          {/*/!*CATEGORIES*!/*/}
          {/*<ProtectedRoute*/}
          {/*  path={routes.categories.add}*/}
          {/*  verifySessionUseCase={verifySessionUseCase}*/}
          {/*>*/}
          {/*  <AddCategoryView />*/}
          {/*</ProtectedRoute>*/}
          {/*<ProtectedRoute*/}
          {/*  path={routes.categories.details}*/}
          {/*  verifySessionUseCase={verifySessionUseCase}*/}
          {/*>*/}
          {/*  <CategoryDetailsView />*/}
          {/*</ProtectedRoute>*/}
          {/*<ProtectedRoute*/}
          {/*  path={routes.categories.list}*/}
          {/*  verifySessionUseCase={verifySessionUseCase}*/}
          {/*>*/}
          {/*  <CategoriesView />*/}
          {/*</ProtectedRoute>*/}
          {/*/!*REPORTS*!/*/}
          {/*<ProtectedRoute*/}
          {/*  path={routes.reports}*/}
          {/*  verifySessionUseCase={verifySessionUseCase}*/}
          {/*>*/}
          {/*  <ReportView />*/}
          {/*</ProtectedRoute>*/}
          {/*/!*SETTINGS*!/*/}
          {/*<ProtectedRoute*/}
          {/*  path={routes.settings}*/}
          {/*  verifySessionUseCase={verifySessionUseCase}*/}
          {/*>*/}
          {/*  <SettingsView />*/}
          {/*</ProtectedRoute>*/}
          {/*LOGIN*/}
          <Route path={routes.login}>
            <LoginView
              loginUseCase={loginUseCase}
              signUpUseCase={signUpUseCase}
            />
          </Route>
        </main>
      </div>
    </Router>
  );
};
