import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { SessionContext } from "@infrastructure/ui/contexts";
import { Session } from "@supabase/supabase-js";

import { Header } from "./Header";

// Mock CSS import
vi.mock("./Header.css", () => ({}));

// Mock the LogoutButton component
vi.mock("@infrastructure/ui/components", () => ({
  // @ts-ignore
  S: () => <button>Mocked Logout</button>,
}));

describe("Header", () => {
  it("renders the header with the application name", () => {
    render(<Header />);

    const appName = screen.getByText(/gualet/i);
    expect(appName).toBeInTheDocument();
  });

  it("renders the LogoutButton component when there is a session", () => {
    render(
      <SessionContext.Provider
        value={{ session: {} as Session, setSession: () => {} }}
      >
        <Header />
      </SessionContext.Provider>,
    );

    const logoutButton = screen.getByTestId("header-settings-cta");
    expect(logoutButton).toBeInTheDocument();
  });
});
