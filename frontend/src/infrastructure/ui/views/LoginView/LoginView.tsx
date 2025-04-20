import React, { useState } from "react";
import "./LoginView.css";
import { LoginUseCase, SignUpUseCase } from "@application/cases";
import { routes } from "@infrastructure/ui/routes";

interface GenerateOnSubmitHandlerParams {
  callback: () => void;
  isSignUp: boolean;
  signUpUseCase: SignUpUseCase;
  loginUseCase: LoginUseCase;
}

export interface LoginFormProps {
  signUpUseCase: SignUpUseCase;
  loginUseCase: LoginUseCase;
}

function generateOnSubmitHandler({
  isSignUp,
  callback,
  signUpUseCase,
  loginUseCase,
}: GenerateOnSubmitHandlerParams) {
  return (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (email && password) {
      if (isSignUp) {
        signUpUseCase.exec({ email, password }).then(callback);
      } else {
        loginUseCase.exec({ email, password }).then(() => {
          window.location.pathname = routes.root;
        });
      }
    }
  };
}

export function LoginForm({ signUpUseCase, loginUseCase }: LoginFormProps) {
  const [showSignUp, setShowSignUp] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const onSubmitHandler = generateOnSubmitHandler({
    signUpUseCase,
    loginUseCase,
    isSignUp: showSignUp,
    callback: () => {
      setSuccessMessage(
        "Your email needs to be confirmed. Please, check your email and click on confirm link.",
      );
    },
  });

  return (
    <div className="login-view">
      <div className="form-selector">
        <button
          className={showSignUp ? "" : "selected"}
          onClick={() => setShowSignUp(false)}
        >
          LOGIN
        </button>
        <button
          className={showSignUp ? "selected" : ""}
          onClick={() => setShowSignUp(true)}
        >
          SIGN UP
        </button>
      </div>
      {showSignUp ? (
        <>
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
                SIGN UP
              </button>
            </footer>
          </form>
          {successMessage && (
            <span className="success-message">{successMessage}</span>
          )}
        </>
      ) : (
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
      )}
    </div>
  );
}

export function LoginView(props: LoginFormProps) {
  return <LoginForm {...props} />;
}
