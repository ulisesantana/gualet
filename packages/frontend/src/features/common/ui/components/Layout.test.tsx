import { describe, expect, it } from "vitest";
import { render, screen } from "@test/test-utils";

import { AlertMessage, LoadingSpinner } from "./Layout";

describe("AlertMessage", () => {
  it("renders children", () => {
    render(<AlertMessage>Something went wrong</AlertMessage>);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("uses role=alert for error status", () => {
    render(<AlertMessage status="error">Error!</AlertMessage>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("uses role=alert for warning status", () => {
    render(<AlertMessage status="warning">Warning!</AlertMessage>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("uses role=status for info status (default)", () => {
    render(<AlertMessage>Info message</AlertMessage>);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("uses role=status for success status", () => {
    render(<AlertMessage status="success">Done!</AlertMessage>);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders title when provided", () => {
    render(<AlertMessage title="My Title">Body</AlertMessage>);
    expect(screen.getByText("My Title")).toBeInTheDocument();
  });
});

describe("LoadingSpinner", () => {
  it("renders without crashing", () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.firstChild).toBeTruthy();
  });
});
