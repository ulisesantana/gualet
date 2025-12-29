import { afterEach, describe, expect, it } from "vitest";
import { Router } from "wouter";
import { routes } from "@common/infrastructure/routes";
import { cleanup, render, screen } from "@test/test-utils";
import { TestRouter } from "@test/TestRouter";

import { Header } from "./Header";

describe("Header", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the logo with link to home", () => {
    render(
      <Router>
        <Header />
      </Router>,
    );

    const logoImage = screen.getByAltText("Gualet logo");
    const logoLink = screen.getByRole("link", { name: /gualet logo/i });

    expect(logoImage).toBeInTheDocument();
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute("href", routes.home);
  });

  it("shows settings icon when on a protected route", () => {
    render(
      <Router>
        <TestRouter path={routes.reports} />
        <Header />
      </Router>,
    );

    const settingsIcon = screen.getByTestId("header-settings-cta");
    const settingsLink = screen.getByRole("link", { name: /settings/i });

    expect(settingsIcon).toBeInTheDocument();
    expect(settingsLink).toBeInTheDocument();
    expect(settingsLink).toHaveAttribute("href", routes.settings);
  });

  it("hides settings icon when on login route", () => {
    render(
      <Router>
        <TestRouter path={routes.login} />
        <Header />
      </Router>,
    );

    expect(screen.queryByTestId("header-settings-cta")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /settings/i }),
    ).not.toBeInTheDocument();
  });

  it("displays the correct logo text", async () => {
    render(
      <Router>
        <Header />
      </Router>,
    );

    expect(screen.getByText("Gualet")).toBeInTheDocument();
  });
});
