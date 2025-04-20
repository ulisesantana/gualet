import { act } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, it, vi } from "vitest";
import { LogoutButton } from "@components";

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
