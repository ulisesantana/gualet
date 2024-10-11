import React, { RefObject, useRef } from "react";
import { supabase } from "@infrastructure/data-sources";

function signUpNewUser(email: string, password: string) {
  return supabase.auth.signUp({
    email,
    password,
  });
}

async function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export function LoginForm() {
  const formRef: RefObject<HTMLFormElement> = useRef(null);

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const action = formData.get("action") as string;

    if (email && password && action) {
      if (action === "LOGIN") {
        signInWithEmail(email, password);
      } else {
        // TODO: Do something, give any feedback for confirming email
        signUpNewUser(email, password);
      }
    }
  };

  return (
    <>
      <form className="login-form" onSubmit={onSubmitHandler} ref={formRef}>
        <label>
          <span>Email:</span>
          <input type="text" name="email" required />
        </label>
        <label>
          <span>Password:</span>
          <input type="password" name="password" required />
        </label>
        <label>
          <span>Action:</span>
          <select name="action">
            <option value="LOGIN">LOGIN</option>
            <option value="SIGN UP">SIGN UP</option>
          </select>
        </label>
        <footer>
          <button type="submit">GO</button>
        </footer>
      </form>
    </>
  );
}

export function LoginView() {
  return <LoginForm />;
}
