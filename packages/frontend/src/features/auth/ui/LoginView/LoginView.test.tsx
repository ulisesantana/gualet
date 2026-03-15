import React from "react";
import { describe, expect, it, vi } from "vitest";
import { routes } from "@common/infrastructure/routes";
import { CommandResponse } from "@common/domain/types";
import { fireEvent, render, screen, waitFor } from "@test/test-utils";

import { LoginUseCase } from "../../application/cases";
import { LoginDemoUseCase } from "../../application/login-demo";
import { LoginForm, LoginView } from "./LoginView";

// Mock para useLocation
const mockSetLocation = vi.fn();
vi.mock("wouter", () => ({
  useLocation: () => ["/login", mockSetLocation],
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
}));

// Mock para LoginUseCase
function createMockLoginUseCase({
  success = false,
  error = null,
}: Partial<CommandResponse> = {}): LoginUseCase {
  return {
    exec: vi.fn().mockResolvedValue({ success, error }),
  } as unknown as LoginUseCase;
}

// Mock para LoginDemoUseCase
function createMockLoginDemoUseCase({
  success = false,
  error = null,
}: Partial<CommandResponse> = {}): LoginDemoUseCase {
  return {
    exec: vi.fn().mockResolvedValue({ success, error }),
  } as unknown as LoginDemoUseCase;
}

describe("LoginForm", () => {
  it("renders login form with email and password inputs", () => {
    const mockLoginUseCase = createMockLoginUseCase({ success: true });
    const mockLoginDemoUseCase = createMockLoginDemoUseCase({ success: true });
    render(
      <LoginForm
        loginUseCase={mockLoginUseCase}
        loginDemoUseCase={mockLoginDemoUseCase}
      />,
    );

    expect(
      screen.getByPlaceholderText(/enter your email/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter your password/i),
    ).toBeInTheDocument();
    expect(screen.getByTestId("submit-login")).toBeInTheDocument();
    expect(screen.getByTestId("demo-login")).toBeInTheDocument();
  });

  it("calls loginUseCase and redirects when login is successful", async () => {
    const mockLoginUseCase = createMockLoginUseCase({ success: true });
    const mockLoginDemoUseCase = createMockLoginDemoUseCase({ success: true });
    render(
      <LoginForm
        loginUseCase={mockLoginUseCase}
        loginDemoUseCase={mockLoginDemoUseCase}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByTestId("submit-login"));

    await waitFor(() => {
      expect(mockLoginUseCase.exec).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
      expect(mockSetLocation).toHaveBeenCalledWith(routes.home);
    });
  });

  it("shows error message when login fails", async () => {
    const errorMessage = "Invalid credentials";
    const mockLoginUseCase = createMockLoginUseCase({
      success: false,
      error: errorMessage,
    });
    const mockLoginDemoUseCase = createMockLoginDemoUseCase({ success: true });
    render(
      <LoginForm
        loginUseCase={mockLoginUseCase}
        loginDemoUseCase={mockLoginDemoUseCase}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByTestId("submit-login"));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it("does not call loginUseCase if email is missing", async () => {
    const mockLoginUseCase = createMockLoginUseCase({ success: true });
    const mockLoginDemoUseCase = createMockLoginDemoUseCase({ success: true });
    render(
      <LoginForm
        loginUseCase={mockLoginUseCase}
        loginDemoUseCase={mockLoginDemoUseCase}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByTestId("submit-login"));

    expect(mockLoginUseCase.exec).not.toHaveBeenCalled();
  });

  it("does not call loginUseCase if password is missing", async () => {
    const mockLoginUseCase = createMockLoginUseCase({ success: true });
    const mockLoginDemoUseCase = createMockLoginDemoUseCase({ success: true });
    render(
      <LoginForm
        loginUseCase={mockLoginUseCase}
        loginDemoUseCase={mockLoginDemoUseCase}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByTestId("submit-login"));

    expect(mockLoginUseCase.exec).not.toHaveBeenCalled();
  });

  it("shows error message when login throws an exception", async () => {
    const errorMessage = "Server error";
    const mockLoginUseCase = {
      exec: vi.fn().mockRejectedValue(new Error(errorMessage)),
    } as unknown as LoginUseCase;
    const mockLoginDemoUseCase = createMockLoginDemoUseCase({ success: true });

    render(
      <LoginForm
        loginUseCase={mockLoginUseCase}
        loginDemoUseCase={mockLoginDemoUseCase}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByTestId("submit-login"));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it("displays register link that points to register route", () => {
    const mockLoginUseCase = createMockLoginUseCase({ success: true });
    const mockLoginDemoUseCase = createMockLoginDemoUseCase({ success: true });
    render(
      <LoginForm
        loginUseCase={mockLoginUseCase}
        loginDemoUseCase={mockLoginDemoUseCase}
      />,
    );

    expect(screen.getByText(/register!/i)).toBeInTheDocument();
    const registerLink = screen.getByText(/register!/i).closest("a");
    expect(registerLink).toHaveAttribute("href", routes.register);
  });

  it("redirects to home on successful login after previous error", async () => {
    const mockLoginUseCase = {
      exec: vi
        .fn()
        .mockResolvedValueOnce({ success: false, error: "Error message" })
        .mockResolvedValueOnce({ success: true }),
    } as unknown as LoginUseCase;
    const mockLoginDemoUseCase = createMockLoginDemoUseCase({ success: true });

    render(
      <LoginForm
        loginUseCase={mockLoginUseCase}
        loginDemoUseCase={mockLoginDemoUseCase}
      />,
    );

    // First call - error
    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByTestId("submit-login"));

    await waitFor(() => {
      expect(screen.getByText("Error message")).toBeInTheDocument();
    });

    // Reset mock to track second call
    mockSetLocation.mockClear();

    // Second call - success
    fireEvent.click(screen.getByTestId("submit-login"));

    await waitFor(() => {
      // After successful login, user is redirected (component would unmount in real app)
      expect(mockSetLocation).toHaveBeenCalledWith(routes.home);
    });
  });

  it("calls loginDemoUseCase when demo button is clicked", async () => {
    const mockLoginUseCase = createMockLoginUseCase({ success: true });
    const mockLoginDemoUseCase = createMockLoginDemoUseCase({ success: true });

    render(
      <LoginForm
        loginUseCase={mockLoginUseCase}
        loginDemoUseCase={mockLoginDemoUseCase}
      />,
    );

    fireEvent.click(screen.getByTestId("demo-login"));

    await waitFor(() => {
      expect(mockLoginDemoUseCase.exec).toHaveBeenCalled();
      expect(mockSetLocation).toHaveBeenCalledWith(routes.home);
    });
  });

  it("shows error message when demo login fails", async () => {
    const errorMessage = "Demo login failed";
    const mockLoginUseCase = createMockLoginUseCase({ success: true });
    const mockLoginDemoUseCase = createMockLoginDemoUseCase({
      success: false,
      error: errorMessage,
    });

    render(
      <LoginForm
        loginUseCase={mockLoginUseCase}
        loginDemoUseCase={mockLoginDemoUseCase}
      />,
    );

    fireEvent.click(screen.getByTestId("demo-login"));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it("shows error message when demo login throws an exception", async () => {
    const errorMessage = "Demo server error";
    const mockLoginUseCase = createMockLoginUseCase({ success: true });
    const mockLoginDemoUseCase = {
      exec: vi.fn().mockRejectedValue(new Error(errorMessage)),
    } as unknown as LoginDemoUseCase;

    render(
      <LoginForm
        loginUseCase={mockLoginUseCase}
        loginDemoUseCase={mockLoginDemoUseCase}
      />,
    );

    fireEvent.click(screen.getByTestId("demo-login"));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});

describe("LoginView", () => {
  it("renders LoginForm with provided props", () => {
    const mockLoginUseCase = createMockLoginUseCase({ success: true });
    const mockLoginDemoUseCase = createMockLoginDemoUseCase({ success: true });
    render(
      <LoginView
        loginUseCase={mockLoginUseCase}
        loginDemoUseCase={mockLoginDemoUseCase}
      />,
    );

    expect(
      screen.getByPlaceholderText(/enter your email/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter your password/i),
    ).toBeInTheDocument();
    expect(screen.getByTestId("submit-login")).toBeInTheDocument();
  });
});
