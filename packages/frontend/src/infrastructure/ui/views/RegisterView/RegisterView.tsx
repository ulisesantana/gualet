import React, { useState } from "react";
import "./RegisterView.css";
import { SignUpUseCase } from "@application/cases";

export interface RegisterFormProps {
  signUpUseCase: SignUpUseCase;
}

export function RegisterForm({ signUpUseCase }: RegisterFormProps) {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const callback = (error?: string) => {
    if (error) {
      setSuccessMessage("");
      setErrorMessage(error);
    } else {
      setSuccessMessage(
        "Your email needs to be confirmed. Please, check your email and click on confirm link.",
      );
    }
  };
  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (email && password) {
      signUpUseCase
        .exec({ email, password })
        .then(({ success, error }) => {
          if (success) {
            callback();
          } else {
            console.error("Registration error:", error);
            callback(error);
          }
        })
        .catch(callback);
    }
  };

  return (
    <div className="register-view">
      <form className="sign-up-form" onSubmit={onSubmitHandler}>
        <label>
          <span>Email:</span>
          <input type="text" name="email" required />
        </label>
        <label>
          <span>Password:</span>
          <input type="password" name="password" required />
        </label>
        <small>Password must contain at least 6 characters</small>
        <footer>
          <button type="submit" name="sign-up" data-testid="submit-sign-up">
            REGISTER
          </button>
        </footer>
      </form>
      {successMessage && (
        <span className="success-message">{successMessage}</span>
      )}
      {errorMessage && <span className="error-message">{errorMessage}</span>}
    </div>
  );
}

export function RegisterView(props: RegisterFormProps) {
  return <RegisterForm {...props} />;
}
