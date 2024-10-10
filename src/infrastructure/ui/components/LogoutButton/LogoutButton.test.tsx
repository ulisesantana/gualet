import { act } from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import { LogoutButton } from "./LogoutButton";

// Mock the logout icon import
jest.mock("./logout.png", () => "mocked-logout-icon.png");

describe("LogoutButton", () => {
  it("renders the button with the logout icon", () => {
    act(() => {
      render(<LogoutButton onLogout={() => {}} />);
    });

    const button = screen.getByRole("button");
    const image = screen.getByAltText("Logout");

    expect(button).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "mocked-logout-icon.png");
  });

  it("calls the onLogout handler when clicked", () => {
    const mockOnLogout = jest.fn();

    act(() => {
      render(<LogoutButton onLogout={mockOnLogout} />);
    });

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });
});
