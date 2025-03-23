import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { LoginView } from "@views";
import { supabase } from "@infrastructure/data-sources";

describe("LoginView should", () => {
  it("renders login form by default", async () => {
    render(<LoginView />);

    await waitFor(() => {
      expect(screen.getByTestId("submit-login")).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });
  });

  it("renders signup form when SignUp is selected", () => {
    render(<LoginView />);

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(screen.getByTestId("submit-sign-up")).toBeInTheDocument();
    expect(
      screen.getByText(/password must contain at least 6 characters/i),
    ).toBeInTheDocument();
  });

  it("calls signIn on login form submission", async () => {
    render(<LoginView />);

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.submit(screen.getByTestId("submit-login"));

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "user@example.com",
        password: "password123",
      });
    });
  });

  it("calls signUp on signup form submission and displays success message", async () => {
    render(<LoginView />);

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: "newuser@example.com" },
    });
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: "newpassword" },
    });

    fireEvent.submit(screen.getByTestId("submit-sign-up"));

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: "newuser@example.com",
        password: "newpassword",
      });
      expect(
        screen.getByText(/your email needs to be confirmed/i),
      ).toBeInTheDocument();
    });
  });

  it("toggles between login and signup forms", () => {
    render(<LoginView />);

    // Initially in login form
    expect(screen.queryByTestId("submit-login")).toBeInTheDocument();

    // Toggle to signup form
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
    expect(screen.queryByTestId("submit-sign-up")).toBeInTheDocument();
    expect(screen.queryByTestId("submit-login")).not.toBeInTheDocument();

    // Toggle back to login form
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(screen.queryByTestId("submit-login")).toBeInTheDocument();
    expect(screen.queryByTestId("submit-sign-up")).not.toBeInTheDocument();
  });
});
