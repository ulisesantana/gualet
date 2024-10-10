import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import { Header } from "./Header";

// Mock CSS import
jest.mock("./Header.css", () => ({}));

// Mock the LogoutButton component
jest.mock("../LogoutButton", () => ({
  LogoutButton: ({ onLogout }: { onLogout: jest.Mock }) => (
    <button onClick={onLogout}>Mocked Logout</button>
  ),
}));

describe("Header", () => {
  const mockOnLogout = jest.fn();

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
