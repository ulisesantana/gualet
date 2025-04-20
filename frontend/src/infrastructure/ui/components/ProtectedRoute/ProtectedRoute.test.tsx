import { render, screen, waitFor } from "@testing-library/react";
import { ProtectedRoute } from "@components";
import { VerifySessionUseCase } from "@application/cases";
import { beforeEach, describe, expect, it, Mock, Mocked, vi } from "vitest";
import * as wouter from "wouter";

vi.mock("wouter", () => ({
  useLocation: vi.fn(),
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
  });

  it("passes path prop correctly to Route component when authenticated", async () => {
    mockVerifySessionUseCase.exec.mockResolvedValue(true);

    render(
      <ProtectedRoute
        path={testPath}
        verifySessionUseCase={mockVerifySessionUseCase}
      >
        {childrenText}
      </ProtectedRoute>,
    );

    await waitFor(() => {
      expect(screen.getByText(childrenText)).toBeInTheDocument();
    });

    const routeElement = screen.getByTestId("route");
    expect(routeElement).toHaveAttribute("data-path", testPath);
  });

  it("verifies authentication immediately on mount", () => {
    mockVerifySessionUseCase.exec.mockReturnValue(new Promise(() => {}));

    render(
      <ProtectedRoute verifySessionUseCase={mockVerifySessionUseCase}>
        {childrenText}
      </ProtectedRoute>,
    );

    expect(mockVerifySessionUseCase.exec).toHaveBeenCalledTimes(1);
  });

  it("preserves authentication state between renders when already authenticated", async () => {
    mockVerifySessionUseCase.exec.mockResolvedValue(true);

    const { rerender } = render(
      <ProtectedRoute verifySessionUseCase={mockVerifySessionUseCase}>
        {childrenText}
      </ProtectedRoute>,
    );

    await waitFor(() => {
      expect(screen.getByText(childrenText)).toBeInTheDocument();
    });

    vi.clearAllMocks();

    rerender(
      <ProtectedRoute
        path="/new-path"
        verifySessionUseCase={mockVerifySessionUseCase}
      >
        <span>Updated content</span>
      </ProtectedRoute>,
    );

    expect(mockVerifySessionUseCase.exec).not.toHaveBeenCalled();
    expect(screen.getByText("Updated content")).toBeInTheDocument();
  });
});
