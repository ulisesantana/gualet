import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@test/test-utils";

import { LogoutButton } from "./LogoutButton";
import { LogoutUseCase } from "../../application/cases";
import { AuthProvider } from "../AuthContext";

describe("LogoutButton", () => {
  const mockLogoutUseCase = {
    exec: vi.fn().mockResolvedValue({ success: true, error: null }),
  } as unknown as LogoutUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the button with the logout icon", () => {
    render(
      <AuthProvider>
        <LogoutButton logoutUseCase={mockLogoutUseCase} />
      </AuthProvider>,
    );

    const button = screen.getByRole("button");
    const image = screen.getByAltText("Logout");

    expect(button).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/icons/logout.png");
  });

  it("calls logout and updates auth state on click", async () => {
    render(
      <AuthProvider>
        <LogoutButton logoutUseCase={mockLogoutUseCase} />
      </AuthProvider>,
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockLogoutUseCase.exec).toHaveBeenCalledTimes(1);
    });
  });
});
