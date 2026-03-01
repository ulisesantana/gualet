import React from "react";
import { describe, expect, it, vi } from "vitest";
import { CommandResponse } from "@common/domain/types";
import { fireEvent, render, screen, waitFor } from "@test/test-utils";

import { SignUpUseCase } from "../../application/cases";
import { RegisterForm, RegisterView } from "./RegisterView";

// Mock wouter
vi.mock("wouter", async () => {
  const actual = await vi.importActual("wouter");
  return {
    ...actual,
    useLocation: vi.fn().mockReturnValue(["", vi.fn()]),
  };
});

function createMockSignUpUseCase({
  success = false,
  error = null,
}: Partial<CommandResponse> = {}): SignUpUseCase {
  return {
    exec: vi.fn().mockResolvedValue({ success, error }),
  } as unknown as SignUpUseCase;
}

describe("RegisterForm", () => {
  it("renders register form with email and password inputs", () => {
    const mockSignUpUseCase = createMockSignUpUseCase({ success: true });
    render(<RegisterForm signUpUseCase={mockSignUpUseCase} />);

    expect(
      screen.getByPlaceholderText(/enter your email/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter your password/i),
    ).toBeInTheDocument();
    expect(screen.getByTestId("submit-sign-up")).toBeInTheDocument();
  });

  it("calls signUpUseCase with correct credentials on submit", async () => {
    const mockSignUpUseCase = createMockSignUpUseCase({ success: true });
    render(<RegisterForm signUpUseCase={mockSignUpUseCase} />);

    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByTestId("submit-sign-up"));

    await waitFor(() => {
      expect(mockSignUpUseCase.exec).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("shows error message when registration fails", async () => {
    const errorMessage = "Email already exists";
    const mockSignUpUseCase = createMockSignUpUseCase({
      success: false,
      error: errorMessage,
    });
    render(<RegisterForm signUpUseCase={mockSignUpUseCase} />);

    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: "existing@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByTestId("submit-sign-up"));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it("shows error message when registration throws an exception", async () => {
    const errorMessage = "Server error";
    const mockSignUpUseCase = {
      exec: vi.fn().mockRejectedValue(new Error(errorMessage)),
    } as unknown as SignUpUseCase;

    render(<RegisterForm signUpUseCase={mockSignUpUseCase} />);

    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByTestId("submit-sign-up"));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it("does not show success message (redirects instead)", async () => {
    const mockSignUpUseCase = createMockSignUpUseCase({ success: true });
    render(<RegisterForm signUpUseCase={mockSignUpUseCase} />);

    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByTestId("submit-sign-up"));

    await waitFor(() => {
      expect(mockSignUpUseCase.exec).toHaveBeenCalled();
    });

    // No success message should be shown - user is redirected instead
    expect(
      screen.queryByText(/your email needs to be confirmed/i),
    ).not.toBeInTheDocument();
  });
});

describe("RegisterView", () => {
  it("renders RegisterForm with provided props", () => {
    const mockSignUpUseCase = createMockSignUpUseCase({ success: true });
    render(<RegisterView signUpUseCase={mockSignUpUseCase} />);

    expect(
      screen.getByPlaceholderText(/enter your email/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter your password/i),
    ).toBeInTheDocument();
    expect(screen.getByTestId("submit-sign-up")).toBeInTheDocument();
  });
});
