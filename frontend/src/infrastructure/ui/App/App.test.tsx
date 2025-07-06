import { beforeEach, describe, it, Mocked, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { App, AppProps } from "@infrastructure/ui/App/App";
import { Router } from "wouter";
import { TestRouter } from "@test/TestRouter";
import {
  LoginUseCase,
  SignUpUseCase,
  VerifySessionUseCase,
} from "@application/cases";
import { UseCase } from "@application/cases/use-case";

vi.mock("@infrastructure/ui/contexts", () => ({
  useSession: vi.fn(),
}));

vi.mock("@views", () => ({
  CategoriesView: () => <div>CategoriesView</div>,
  LastTransactionsView: () => <div>LastTransactionsView</div>,
  LoginView: () => <div>LoginView</div>,
  SettingsView: () => <div>SettingsView</div>,
  CategoryDetailsView: () => <div>CategoryDetailsView</div>,
  TransactionDetailsView: () => <div>TransactionDetailsView</div>,
  AddCategoryView: () => <div>AddCategoryView</div>,
  ReportView: () => <div>ReportView</div>,
  RegisterView: () => <div>RegisterView</div>,
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
        <TestRouter path="/" />
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

  it.skip("renders categories views on /categories route", async () => {
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

  it.skip("renders view for adding categories on /categories/add route", async () => {
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

  it.skip("renders settings view on /settings route", async () => {
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

  it.skip("renders category details view on /categories/:id route", async () => {
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

  it.skip("renders transaction details view on /transactions/:id route", async () => {
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
