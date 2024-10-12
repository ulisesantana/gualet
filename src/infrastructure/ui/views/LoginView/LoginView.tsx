import React, { RefObject, useRef, useState } from "react";
import { supabase } from "@infrastructure/data-sources";
import "./LoginView.css";

function signUpNewUser(email: string, password: string) {
  return supabase.auth.signUp({
    email,
    password,
  });
}

function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

interface GenerateOnSubmitHandlerParams {
  callback: () => void;
  signUp: boolean;
}

function generateOnSubmitHandler({
  signUp,
  callback,
}: GenerateOnSubmitHandlerParams) {
  return (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (email && password) {
      if (signUp) {
        signUpNewUser(email, password).then(callback);
      } else {
        signInWithEmail(email, password);
      }
    }
  };
}

export function LoginForm() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const onSubmitHandler = generateOnSubmitHandler({
    signUp: showSignUp,
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
              <button type="submit">SIGN UP</button>
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
            <button type="submit">LOGIN</button>
          </footer>
        </form>
      )}
    </div>
  );
}

export function LoginView() {
  return <LoginForm />;
}
