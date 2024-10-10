import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { Header } from "./Header";

// Mock CSS import
vi.mock("./Header.css", () => ({}));

// Mock the LogoutButton component
vi.mock("../LogoutButton", () => ({
  // @ts-ignore
  LogoutButton: ({ onLogout }) => (
    <button onClick={onLogout}>Mocked Logout</button>
  ),
}));

describe("Header", () => {
  const mockOnLogout = vi.fn();

  it("renders the header with the application name", () => {
    render(<Header onLogout={mockOnLogout} />);

    const appName = screen.getByText(/misperrapp/i);
    expect(appName).toBeInTheDocument();
  });

  it("renders the LogoutButton component", () => {
    render(<Header onLogout={mockOnLogout} />);

    const logoutButton = screen.getByText("Mocked Logout");
    expect(logoutButton).toBeInTheDocument();
  });

  it("calls onLogout when LogoutButton is clicked", () => {
    render(<Header onLogout={mockOnLogout} />);

    const logoutButton = screen.getByText("Mocked Logout");
    fireEvent.click(logoutButton);

    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });
});
