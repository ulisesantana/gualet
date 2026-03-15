import { beforeEach, describe, it, Mocked, vi } from "vitest";
import { Router } from "wouter";
import { TestRouter } from "@test/TestRouter";
import { UseCase } from "@common/application/use-case";
import React from "react";
import { render, screen, waitFor } from "@test/test-utils";

import {
  LoginUseCase,
  SignUpUseCase,
  VerifySessionUseCase,
} from "../../../auth/application/cases";
import { App, AppProps } from "./App";

vi.mock("@auth", () => {
  const actualAuth = vi.importActual("@auth");
  return {
    ...actualAuth,
    LoginView: () => <div>LoginView</div>,
    RegisterView: () => <div>RegisterView</div>,
    ProtectedRoute: ({ children, verifySessionUseCase, path }: any) => {
      const [isAuthenticated, setIsAuthenticated] = React.useState(false);
      const [loading, setLoading] = React.useState(true);

      React.useEffect(() => {
        verifySessionUseCase
          .exec()
          .then((result: any) => {
            setIsAuthenticated(result.success);
          })
          .catch(() => {
            setIsAuthenticated(false);
          })
          .finally(() => {
            setLoading(false);
          });
      }, [verifySessionUseCase]);

      if (loading) return null;
      if (!isAuthenticated) return null;

      return <>{children}</>;
    },
  };
});

vi.mock("@categories", () => ({
  AddCategoryView: () => <div>AddCategoryView</div>,
  CategoriesView: () => <div>CategoriesView</div>,
  CategoryDetailsView: () => <div>CategoryDetailsView</div>,
}));

vi.mock("@payment-methods", () => ({
  AddPaymentMethodView: () => <div>AddPaymentMethodView</div>,
  PaymentMethodDetailsView: () => <div>PaymentMethodDetailsView</div>,
  PaymentMethodsView: () => <div>PaymentMethodsView</div>,
}));

vi.mock("@transactions", () => ({
  LastTransactionsView: () => <div>LastTransactionsView</div>,
  TransactionDetailsView: () => <div>TransactionDetailsView</div>,
}));

vi.mock("@reports", () => ({
  ReportView: () => <div>ReportView</div>,
}));

vi.mock("@settings", () => ({
  SettingsView: () => <div>SettingsView</div>,
}));

describe("App Component", () => {
  let props: AppProps;
  let cases: Record<string, Mocked<UseCase<any, any>>>;

  beforeEach(() => {
    cases = {
      loginUseCase: {
        exec: vi
          .fn()
          .mockResolvedValue({ success: false, error: "Token expired" }),
      } as unknown as Mocked<LoginUseCase>,
      signUpUseCase: {
        exec: vi
          .fn()
          .mockResolvedValue({ success: false, error: "Token expired" }),
      } as unknown as Mocked<SignUpUseCase>,
      verifySessionUseCase: {
        exec: vi
          .fn()
          .mockResolvedValue({ success: false, error: "Token expired" }),
      } as unknown as Mocked<VerifySessionUseCase>,
    };
    props = { cases } as unknown as AppProps;
  });

  it("renders login view when no session is present", async () => {
    render(
      <Router>
        <TestRouter path="/login" />
        <App {...props} />
      </Router>,
    );

    await waitFor(() => {
      expect(screen.getByText("LoginView")).toBeInTheDocument();
    });
  });

  it("renders last transaction view on / route", async () => {
    cases.verifySessionUseCase.exec.mockResolvedValue({ success: true });
    render(
      <Router>
        <TestRouter path="/" />
        <App {...props} />
      </Router>,
    );

    await waitFor(() => {
      expect(screen.getByText("LastTransactionsView")).toBeInTheDocument();
    });
  });

  it("renders categories views on /categories route", async () => {
    cases.verifySessionUseCase.exec.mockResolvedValue({ success: true });
    render(
      <Router>
        <TestRouter path="/categories" />
        <App {...props} />
      </Router>,
    );

    await waitFor(() => {
      expect(screen.getByText("CategoriesView")).toBeInTheDocument();
    });
  });

  it("renders view for adding categories on /categories/add route", async () => {
    cases.verifySessionUseCase.exec.mockResolvedValue({ success: true });
    render(
      <Router>
        <TestRouter path="/categories/add" />
        <App {...props} />
      </Router>,
    );

    await waitFor(() => {
      expect(screen.getByText("AddCategoryView")).toBeInTheDocument();
    });
  });

  it("renders settings view on /settings route", async () => {
    cases.verifySessionUseCase.exec.mockResolvedValue({ success: true });
    render(
      <Router>
        <TestRouter path="/settings" />
        <App {...props} />
      </Router>,
    );

    await waitFor(() => {
      expect(screen.getByText("SettingsView")).toBeInTheDocument();
    });
  });

  it("renders category details view on /categories/:id route", async () => {
    cases.verifySessionUseCase.exec.mockResolvedValue({ success: true });
    render(
      <Router>
        <TestRouter path="/categories/details/1" />
        <App {...props} />
      </Router>,
    );

    await waitFor(() => {
      expect(screen.getByText("CategoryDetailsView")).toBeInTheDocument();
    });
  });

  it("renders transaction details view on /transactions/:id route", async () => {
    cases.verifySessionUseCase.exec.mockResolvedValue({ success: true });
    render(
      <Router>
        <TestRouter path="/transactions/details/1" />
        <App {...props} />
      </Router>,
    );

    await waitFor(() => {
      expect(screen.getByText("TransactionDetailsView")).toBeInTheDocument();
    });
  });
});
