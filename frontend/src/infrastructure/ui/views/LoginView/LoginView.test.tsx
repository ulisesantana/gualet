import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { LoginForm, LoginView } from "@views";
import { LoginUseCase } from "@application/cases";
import "@testing-library/jest-dom";
import { describe, expect, it, vi } from "vitest";
import { routes } from "@infrastructure/ui/routes";
import { CommandResponse } from "@domain/types";

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

describe("LoginForm", () => {
  it("renders login form with email and password inputs", () => {
    const mockLoginUseCase = createMockLoginUseCase({ success: true });
    render(<LoginForm loginUseCase={mockLoginUseCase} />);

    expect(screen.getByLabelText(/email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password:/i)).toBeInTheDocument();
    expect(screen.getByTestId("submit-login")).toBeInTheDocument();
  });

  it("calls loginUseCase and redirects when login is successful", async () => {
    const mockLoginUseCase = createMockLoginUseCase({ success: true });
    render(<LoginForm loginUseCase={mockLoginUseCase} />);

    fireEvent.change(screen.getByLabelText(/email:/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password:/i), {
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
    render(<LoginForm loginUseCase={mockLoginUseCase} />);

    fireEvent.change(screen.getByLabelText(/email:/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password:/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByTestId("submit-login"));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it("does not call loginUseCase if email is missing", async () => {
    const mockLoginUseCase = createMockLoginUseCase({ success: true });
    render(<LoginForm loginUseCase={mockLoginUseCase} />);

    fireEvent.change(screen.getByLabelText(/password:/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByTestId("submit-login"));

    expect(mockLoginUseCase.exec).not.toHaveBeenCalled();
  });

  it("does not call loginUseCase if password is missing", async () => {
    const mockLoginUseCase = createMockLoginUseCase({ success: true });
    render(<LoginForm loginUseCase={mockLoginUseCase} />);

    fireEvent.change(screen.getByLabelText(/email:/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByTestId("submit-login"));

    expect(mockLoginUseCase.exec).not.toHaveBeenCalled();
  });

  it("shows error message when login throws an exception", async () => {
    const errorMessage = "Server error";
    const mockLoginUseCase = {
      exec: vi.fn().mockRejectedValue(errorMessage),
    } as unknown as LoginUseCase;

    render(<LoginForm loginUseCase={mockLoginUseCase} />);

    fireEvent.change(screen.getByLabelText(/email:/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password:/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByTestId("submit-login"));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it("displays register link that points to register route", () => {
    const mockLoginUseCase = createMockLoginUseCase({ success: true });
    render(<LoginForm loginUseCase={mockLoginUseCase} />);

    expect(screen.getByText(/register!/i)).toBeInTheDocument();
    const registerLink = screen.getByText(/register!/i).closest("a");
    expect(registerLink).toHaveAttribute("href", routes.register);
  });

  it("clears error message on successful login", async () => {
    const mockLoginUseCase = {
      exec: vi
        .fn()
        .mockResolvedValueOnce({ success: false, error: "Error message" })
        .mockResolvedValueOnce({ success: true }),
    } as unknown as LoginUseCase;

    render(<LoginForm loginUseCase={mockLoginUseCase} />);

    // Primera llamada - error
    fireEvent.change(screen.getByLabelText(/email:/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password:/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByTestId("submit-login"));

    await waitFor(() => {
      expect(screen.getByText("Error message")).toBeInTheDocument();
    });

    // Segunda llamada - éxito
    fireEvent.click(screen.getByTestId("submit-login"));

    await waitFor(() => {
      expect(screen.queryByText("Error message")).not.toBeInTheDocument();
    });
  });
});

describe("LoginView", () => {
  it("renders LoginForm with provided props", () => {
    const mockLoginUseCase = createMockLoginUseCase({ success: true });
    render(<LoginView loginUseCase={mockLoginUseCase} />);

    expect(screen.getByLabelText(/email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password:/i)).toBeInTheDocument();
    expect(screen.getByTestId("submit-login")).toBeInTheDocument();
  });
});
