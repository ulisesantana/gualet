import { act } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, beforeEach } from "vitest";
import { LogoutButton } from "@components";
import { supabase } from "@infrastructure/data-sources";

vi.mock("@infrastructure/data-sources", () => ({
  supabase: {
    auth: {
      signOut: vi.fn(),
    },
  },
}));

describe("LogoutButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the button with the logout icon", () => {
    act(() => {
      render(<LogoutButton />);
    });

    const button = screen.getByRole("button");
    const image = screen.getByAltText("Logout");

    expect(button).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/icons/logout.png");
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
