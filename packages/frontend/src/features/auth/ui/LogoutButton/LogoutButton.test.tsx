import { beforeEach, describe, expect, it, vi } from "vitest";
import * as wouter from "wouter";
import { fireEvent, render, screen, waitFor } from "@test/test-utils";

import { LogoutButton } from "./LogoutButton";
import { LogoutUseCase } from "../../application/cases";
import { AuthContext, AuthProvider } from "../AuthContext";

vi.mock("wouter", async () => {
  const actual = await vi.importActual<typeof wouter>("wouter");
  return { ...actual, useLocation: vi.fn() };
});

describe("LogoutButton", () => {
  const mockSetLocation = vi.fn();
  const mockLogoutUseCase = {
    exec: vi.fn().mockResolvedValue({ success: true, error: null }),
  } as unknown as LogoutUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    (wouter.useLocation as ReturnType<typeof vi.fn>).mockReturnValue([
      "/",
      mockSetLocation,
    ]);
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

  it("calls logout use case on click", async () => {
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

  it("calls auth logout and redirects to /login after successful logout", async () => {
    const mockLogout = vi.fn();
    render(
      <AuthContext.Provider
        value={{
          isAuthenticated: true,
          setIsAuthenticated: vi.fn(),
          logout: mockLogout,
        }}
      >
        <LogoutButton logoutUseCase={mockLogoutUseCase} />
      </AuthContext.Provider>,
    );

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
      expect(mockSetLocation).toHaveBeenCalledWith("/login");
    });
  });
});
