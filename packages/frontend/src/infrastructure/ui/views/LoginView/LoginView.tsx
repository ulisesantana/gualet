import React, { useState } from "react";
import "./LoginView.css";
import { LoginUseCase } from "@application/cases";
import { routes } from "@infrastructure/ui/routes";
import { Link, useLocation } from "wouter";

export interface LoginFormProps {
  loginUseCase: LoginUseCase;
}

export function LoginForm({ loginUseCase }: LoginFormProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const [_location, setLocation] = useLocation();
  const callback = (error?: string) => {
    console.log("error", error, error === undefined);
    if (error) {
      setErrorMessage(error);
    } else {
      setErrorMessage("");
      setLocation(routes.home);
    }
  };

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (email && password) {
      loginUseCase
        .exec({ email, password })
        .then(({ success, error }) => {
          if (success) {
            callback();
          } else {
            callback(error);
          }
        })
        .catch(callback);
    }
  };

  return (
    <div className="login-view">
      <form className="login-form" onSubmit={onSubmitHandler}>
        <label>
          <span>Email:</span>
          <input type="text" name="email" required />
        </label>
        <label>
          <span>Password:</span>
          <input type="password" name="password" required />
        </label>
        <footer>
          <button type="submit" name="login" data-testid="submit-login">
            LOGIN
          </button>
        </footer>
      </form>
      {errorMessage && <span className="error-message">{errorMessage}</span>}
      <span className="register-cta">
        Doesn't have an account? <Link to={routes.register}>Register!</Link>
      </span>
    </div>
  );
}

export function LoginView(props: LoginFormProps) {
  return <LoginForm {...props} />;
}
