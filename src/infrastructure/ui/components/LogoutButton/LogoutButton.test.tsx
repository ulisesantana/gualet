import { act } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { LogoutButton } from "@components";
import { supabase } from "@infrastructure/data-sources";

// Mock the logout icon import
vi.mock("./logout.png", () => ({
  default: "mocked-logout-icon.png",
}));

vi.mock("@infrastructure/data-sources", () => ({
  supabase: {
    auth: {
      signOut: vi.fn(),
    },
  },
}));

describe("LogoutButton", () => {
  it("renders the button with the logout icon", () => {
    act(() => {
      render(<LogoutButton />);
    });

    const button = screen.getByRole("button");
    const image = screen.getByAltText("Logout");

    expect(button).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "mocked-logout-icon.png");
  });

  it("calls the onLogout handler when clicked", () => {
    act(() => {
      render(<LogoutButton />);
    });

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
  });
});
