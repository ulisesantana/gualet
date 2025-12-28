import { describe, expect, it, vi } from "vitest";
import { routes } from "@common/infrastructure/routes";
import { render, screen } from "@test/test-utils";

import { Header } from "./Header";

let { mockLocation, mockSetLocation } = vi.hoisted(() => {
  return { mockLocation: "/settings", mockSetLocation: vi.fn() };
});
// Mock wouter
vi.mock("wouter", () => ({
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
  useLocation: () => [mockLocation, mockSetLocation],
}));

describe("Header", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders the logo with link to home", () => {
    render(<Header />);

    const logoImage = screen.getByAltText("Gualet logo");
    const logoLink = screen.getByRole("link", { name: /gualet logo/i });

    expect(logoImage).toBeInTheDocument();
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute("href", routes.home);
  });

  it("shows settings icon when on a protected route", () => {
    render(<Header />);

    const settingsIcon = screen.getByTestId("header-settings-cta");
    const settingsLink = screen.getByRole("link", { name: /settings/i });

    expect(settingsIcon).toBeInTheDocument();
    expect(settingsLink).toBeInTheDocument();
    expect(settingsLink).toHaveAttribute("href", routes.settings);
  });

  it("hides settings icon when on login route", () => {
    mockLocation = routes.login;
    render(<Header />);

    expect(screen.queryByTestId("header-settings-cta")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /settings/i }),
    ).not.toBeInTheDocument();
  });

  it("displays the correct logo text", async () => {
    render(<Header />);

    expect(screen.getByText("Gualet")).toBeInTheDocument();
  });
});
