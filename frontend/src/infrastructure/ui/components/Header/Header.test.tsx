import { render, screen } from "@testing-library/react";
import * as wouter from "wouter";
import { routes } from "@infrastructure/ui/routes";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Header } from "./Header";

// Mock wouter
vi.mock("wouter", () => ({
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to} data-testid={`link-to-${to}`}>
      {children}
    </a>
  ),
  useLocation: vi.fn(),
}));

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the logo with link to home", () => {
    vi.mocked(wouter.useLocation).mockReturnValue(["/dashboard", vi.fn()]);

    render(<Header />);

    const logoImage = screen.getByAltText("Gualet logo");
    const logoLink = screen.getByTestId(`link-to-${routes.home}`);

    expect(logoImage).toBeInTheDocument();
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toContainElement(logoImage);
  });

  it("shows settings icon when on a protected route", () => {
    vi.mocked(wouter.useLocation).mockReturnValue(["/dashboard", vi.fn()]);

    render(<Header />);

    const settingsIcon = screen.getByTestId("header-settings-cta");
    const settingsLink = screen.getByTestId(`link-to-${routes.settings}`);

    expect(settingsIcon).toBeInTheDocument();
    expect(settingsLink).toBeInTheDocument();
    expect(settingsIcon).toContainElement(settingsLink);
  });

  it("hides settings icon when on login route", () => {
    vi.mocked(wouter.useLocation).mockReturnValue([routes.login, vi.fn()]);

    render(<Header />);

    expect(screen.queryByTestId("header-settings-cta")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId(`link-to-${routes.settings}`),
    ).not.toBeInTheDocument();
  });

  it("displays the correct logo text", () => {
    vi.mocked(wouter.useLocation).mockReturnValue([routes.reports, vi.fn()]);

    render(<Header />);

    expect(screen.getByText("Gualet")).toBeInTheDocument();
  });
});
