import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { SignUpUseCase } from "@application/cases";
import "@testing-library/jest-dom";
import { describe, expect, it, vi } from "vitest";
import { RegisterForm, RegisterView } from "@views";
import { CommandResponse } from "@domain/types";

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

    expect(screen.getByLabelText(/email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password:/i)).toBeInTheDocument();
    expect(screen.getByTestId("submit-sign-up")).toBeInTheDocument();
  });

  it("shows success message when registration is successful", async () => {
    const mockSignUpUseCase = createMockSignUpUseCase({ success: true });
    render(<RegisterForm signUpUseCase={mockSignUpUseCase} />);

    fireEvent.change(screen.getByLabelText(/email:/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password:/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByTestId("submit-sign-up"));

    await waitFor(() => {
      expect(mockSignUpUseCase.exec).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
      expect(
        screen.getByText(/your email needs to be confirmed/i),
      ).toBeInTheDocument();
    });
  });

  it("shows error message when registration fails", async () => {
    const errorMessage = "Email already exists";
    const mockSignUpUseCase = createMockSignUpUseCase({
      success: false,
      error: errorMessage,
    });
    render(<RegisterForm signUpUseCase={mockSignUpUseCase} />);

    fireEvent.change(screen.getByLabelText(/email:/i), {
      target: { value: "existing@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password:/i), {
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
      exec: vi.fn().mockRejectedValue(errorMessage),
    } as unknown as SignUpUseCase;

    render(<RegisterForm signUpUseCase={mockSignUpUseCase} />);

    fireEvent.change(screen.getByLabelText(/email:/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password:/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByTestId("submit-sign-up"));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it("clears success message when error occurs", async () => {
    const mockSignUpUseCase = {
      exec: vi
        .fn()
        .mockResolvedValueOnce({ success: true })
        .mockResolvedValueOnce({ success: false, error: "Error message" }),
    } as unknown as SignUpUseCase;

    render(<RegisterForm signUpUseCase={mockSignUpUseCase} />);

    // Primera llamada - éxito
    fireEvent.change(screen.getByLabelText(/email:/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password:/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByTestId("submit-sign-up"));

    await waitFor(() => {
      expect(
        screen.getByText(/your email needs to be confirmed/i),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("submit-sign-up"));

    await waitFor(() => {
      expect(
        screen.queryByText(/your email needs to be confirmed/i),
      ).not.toBeInTheDocument();
      expect(screen.getByText("Error message")).toBeInTheDocument();
    });
  });
});

describe("RegisterView", () => {
  it("renders RegisterForm with provided props", () => {
    const mockSignUpUseCase = createMockSignUpUseCase({ success: true });
    render(<RegisterView signUpUseCase={mockSignUpUseCase} />);

    expect(screen.getByLabelText(/email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password:/i)).toBeInTheDocument();
    expect(screen.getByTestId("submit-sign-up")).toBeInTheDocument();
  });
});
