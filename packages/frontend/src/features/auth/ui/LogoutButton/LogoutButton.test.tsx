import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LogoutButton } from "./LogoutButton";
import { LogoutUseCase } from "../../application/cases";

describe("LogoutButton", () => {
  const mockLogoutUseCase = {
    exec: vi.fn().mockResolvedValue({ success: true, error: null }),
  } as unknown as LogoutUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the button with the logout icon", () => {
    render(<LogoutButton logoutUseCase={mockLogoutUseCase} />);

    const button = screen.getByRole("button");
    const image = screen.getByAltText("Logout");

    expect(button).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/icons/logout.png");
  });

  it("calls the onLogout handler when clicked", async () => {
    render(<LogoutButton logoutUseCase={mockLogoutUseCase} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    await vi.waitFor(() => {
      expect(mockLogoutUseCase.exec).toHaveBeenCalledTimes(1);
    });
  });
});
