import { beforeEach, describe, expect, it, Mock, Mocked, vi } from "vitest";
import * as wouter from "wouter";
import { render, screen, waitFor } from "@test/test-utils";

import { ProtectedRoute } from "./ProtectedRoute";
import { VerifySessionUseCase } from "../../application/cases";
import { AuthContext, AuthProvider } from "../AuthContext";

vi.mock("wouter", () => ({
  useLocation: vi.fn(),
  useRoute: vi.fn(),
  Route: ({ children, path }: { children: React.ReactNode; path?: string }) => (
    <div data-testid="route" data-path={path}>
      {children}
    </div>
  ),
}));

describe("ProtectedRoute", () => {
  const mockVerifySessionUseCase = {
    exec: vi.fn(),
  } as unknown as Mocked<VerifySessionUseCase>;

  const mockSetLocation = vi.fn();
  const childrenText = "Protected content";
  const testPath = "/protected";

  beforeEach(() => {
    vi.clearAllMocks();
    (wouter.useLocation as Mock).mockReturnValue(["", mockSetLocation]);
    // Default: route matches
    (wouter.useRoute as Mock).mockReturnValue([true, {}]);
  });

  it("shows loader initially (while session is being verified)", () => {
    render(
      <AuthProvider>
        <ProtectedRoute
          path={testPath}
          verifySessionUseCase={mockVerifySessionUseCase}
        >
          {childrenText}
        </ProtectedRoute>
      </AuthProvider>,
    );

    // Initially shows loader (isAuthenticated is null)
    expect(screen.getByTestId("loader")).toBeInTheDocument();
    expect(screen.queryByText(childrenText)).not.toBeInTheDocument();
  });

  it("shows children when authenticated", async () => {
    render(
      <AuthContext.Provider
        value={{
          isAuthenticated: true,
          setIsAuthenticated: vi.fn(),
          logout: vi.fn(),
        }}
      >
        <ProtectedRoute
          path={testPath}
          verifySessionUseCase={mockVerifySessionUseCase}
        >
          {childrenText}
        </ProtectedRoute>
      </AuthContext.Provider>,
    );

    await waitFor(() => {
      expect(screen.getByText(childrenText)).toBeInTheDocument();
    });

    const routeElement = screen.getByTestId("route");
    expect(routeElement).toHaveAttribute("data-path", testPath);
  });

  it("hides content when not authenticated", () => {
    render(
      <AuthContext.Provider
        value={{
          isAuthenticated: false,
          setIsAuthenticated: vi.fn(),
          logout: vi.fn(),
        }}
      >
        <ProtectedRoute
          path={testPath}
          verifySessionUseCase={mockVerifySessionUseCase}
        >
          {childrenText}
        </ProtectedRoute>
      </AuthContext.Provider>,
    );

    expect(screen.queryByText(childrenText)).not.toBeInTheDocument();
    expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
  });

  it("returns null when route does not match", () => {
    // Route doesn't match
    (wouter.useRoute as Mock).mockReturnValue([false, {}]);

    render(
      <AuthContext.Provider
        value={{
          isAuthenticated: true,
          setIsAuthenticated: vi.fn(),
          logout: vi.fn(),
        }}
      >
        <ProtectedRoute
          path="/other-path"
          verifySessionUseCase={mockVerifySessionUseCase}
        >
          {childrenText}
        </ProtectedRoute>
      </AuthContext.Provider>,
    );

    expect(screen.queryByText(childrenText)).not.toBeInTheDocument();
    expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
  });
});
