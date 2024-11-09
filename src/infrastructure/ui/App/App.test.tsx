import { beforeEach, describe, it, Mock, vi } from "vitest";
import { useSession } from "@infrastructure/ui/contexts";
import { supabase } from "@infrastructure/data-sources";
import { render, screen, waitFor } from "@testing-library/react";
import { App } from "@infrastructure/ui/App/App";
import { Router } from "wouter";
import { TestRouter } from "@test/TestRouter";

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
}));

describe("App Component", () => {
  const mockSetSession = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useSession as Mock).mockReturnValue({
      session: null,
      setSession: mockSetSession,
    });
  });

  it("renders login view when no session is present", async () => {
    (supabase.auth.getSession as Mock).mockResolvedValue({
      data: { session: null },
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("LoginView")).toBeInTheDocument();
    });
  });

  it("renders last transaction view when session is present", async () => {
    const mockSession = { user: { id: "user-123" } };
    (useSession as Mock).mockReturnValue({
      session: mockSession,
      setSession: mockSetSession,
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("LastTransactionsView")).toBeInTheDocument();
    });
  });

  it("renders categories views on /categories route", async () => {
    const mockSession = { user: { id: "user-123" } };
    (useSession as Mock).mockReturnValue({
      session: mockSession,
      setSession: mockSetSession,
    });

    render(
      <Router>
        <TestRouter path="/categories" />
        <App />
      </Router>,
    );

    await waitFor(() => {
      expect(screen.getByText("CategoriesView")).toBeInTheDocument();
    });
  });

  it("renders view for adding categories on /categories/add route", async () => {
    const mockSession = { user: { id: "user-123" } };
    (useSession as Mock).mockReturnValue({
      session: mockSession,
      setSession: mockSetSession,
    });

    render(
      <Router>
        <TestRouter path="/categories/add" />
        <App />
      </Router>,
    );

    await waitFor(() => {
      expect(screen.getByText("AddCategoryView")).toBeInTheDocument();
    });
  });

  it("renders settings view on /settings route", async () => {
    const mockSession = { user: { id: "user-123" } };
    (useSession as Mock).mockReturnValue({
      session: mockSession,
      setSession: mockSetSession,
    });

    render(
      <Router>
        <TestRouter path="/settings" />
        <App />
      </Router>,
    );

    await waitFor(() => {
      expect(screen.getByText("SettingsView")).toBeInTheDocument();
    });
  });

  it("renders category details view on /categories/:id route", async () => {
    const mockSession = { user: { id: "user-123" } };
    (useSession as Mock).mockReturnValue({
      session: mockSession,
      setSession: mockSetSession,
    });

    render(
      <Router>
        <TestRouter path="/categories/details/1" />
        <App />
      </Router>,
    );

    await waitFor(() => {
      expect(screen.getByText("CategoryDetailsView")).toBeInTheDocument();
    });
  });

  it("renders transaction details view on /transactions/:id route", async () => {
    const mockSession = { user: { id: "user-123" } };
    (useSession as Mock).mockReturnValue({
      session: mockSession,
      setSession: mockSetSession,
    });

    render(
      <Router>
        <TestRouter path="/transactions/details/1" />
        <App />
      </Router>,
    );

    await waitFor(() => {
      expect(screen.getByText("TransactionDetailsView")).toBeInTheDocument();
    });
  });
});
