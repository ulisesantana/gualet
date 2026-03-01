import { beforeEach, describe, expect, it, vi } from "vitest";
import { Id, PaymentMethod, UserPreferences } from "@domain/models";
import { fireEvent, render, screen, waitFor } from "@test/test-utils";
import "@common/infrastructure/i18n/config";

import { SettingsView } from "./SettingsView";
import {
  GetUserPreferencesUseCase,
  SaveUserPreferencesUseCase,
} from "../../application/cases";
import { GetAllPaymentMethodsUseCase } from "../../../payment-methods/application/cases";
import { LogoutUseCase } from "../../../auth/application/cases";
import { AuthProvider } from "../../../auth/ui/AuthContext";

const mockPaymentMethods = [
  new PaymentMethod({ id: new Id("1"), name: "Credit Card" }),
  new PaymentMethod({ id: new Id("2"), name: "Cash" }),
];

const mockPreferences: UserPreferences = {
  defaultPaymentMethod: mockPaymentMethods[0],
  language: "en",
};

const mockGetAllPaymentMethodsUseCase = {
  exec: vi.fn().mockResolvedValue(mockPaymentMethods),
} as unknown as GetAllPaymentMethodsUseCase;

const mockGetUserPreferencesUseCase = {
  exec: vi.fn().mockResolvedValue(mockPreferences),
} as unknown as GetUserPreferencesUseCase;

const mockSaveUserPreferencesUseCase = {
  exec: vi.fn().mockResolvedValue(undefined),
} as unknown as SaveUserPreferencesUseCase;

const mockLogoutUseCase = {
  exec: vi.fn().mockResolvedValue({ success: true, error: null }),
} as unknown as LogoutUseCase;

vi.mock("@common/infrastructure/hooks", () => ({
  useLoader: vi.fn(() => ({
    isLoading: false,
    setIsLoading: vi.fn(),
    Loader: () => <div data-testid="loader">Loading...</div>,
  })),
}));

vi.mock("@components", () => ({
  Loader: () => <div data-testid="loader">Loading...</div>,
  LogoutButton: () => <button>Logout</button>,
}));

describe("SettingsView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders Loader when loading is true", async () => {
    const { useLoader } = await import("@common/infrastructure/hooks");
    // @ts-ignore
    useLoader.mockReturnValueOnce({
      isLoading: true,
      setIsLoading: vi.fn(),
      Loader: () => <div>Loader</div>,
    });

    render(
      <AuthProvider>
        <SettingsView
          getAllPaymentMethodsUseCase={mockGetAllPaymentMethodsUseCase}
          getUserPreferencesUseCase={mockGetUserPreferencesUseCase}
          saveUserPreferencesUseCase={mockSaveUserPreferencesUseCase}
          logoutUseCase={mockLogoutUseCase}
        />
      </AuthProvider>,
    );
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("renders settings options after loading", async () => {
    render(
      <AuthProvider>
        <SettingsView
          getAllPaymentMethodsUseCase={mockGetAllPaymentMethodsUseCase}
          getUserPreferencesUseCase={mockGetUserPreferencesUseCase}
          saveUserPreferencesUseCase={mockSaveUserPreferencesUseCase}
          logoutUseCase={mockLogoutUseCase}
        />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Add a new category")).toBeInTheDocument();
      expect(screen.getByText("Manage categories")).toBeInTheDocument();
      expect(
        screen.getByTestId("select-default-payment-method"),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /logout/i }),
      ).toBeInTheDocument();
    });
  });

  it("loads and displays the user's default payment method", async () => {
    render(
      <AuthProvider>
        <SettingsView
          getAllPaymentMethodsUseCase={mockGetAllPaymentMethodsUseCase}
          getUserPreferencesUseCase={mockGetUserPreferencesUseCase}
          saveUserPreferencesUseCase={mockSaveUserPreferencesUseCase}
          logoutUseCase={mockLogoutUseCase}
        />
      </AuthProvider>,
    );

    await waitFor(() => {
      const dropdown = screen.getByTestId("select-default-payment-method");
      expect(dropdown).toHaveValue("1");
    });
  });

  it("changes and saves the default payment method", async () => {
    render(
      <AuthProvider>
        <SettingsView
          getAllPaymentMethodsUseCase={mockGetAllPaymentMethodsUseCase}
          getUserPreferencesUseCase={mockGetUserPreferencesUseCase}
          saveUserPreferencesUseCase={mockSaveUserPreferencesUseCase}
          logoutUseCase={mockLogoutUseCase}
        />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("select-default-payment-method"),
      ).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId("select-default-payment-method"), {
      target: { value: "2" },
    });

    await waitFor(() => {
      expect(mockSaveUserPreferencesUseCase.exec).toHaveBeenCalledWith({
        defaultPaymentMethod: mockPaymentMethods[1],
        language: "en",
      });
    });
  });

  it("logs an error if fetching data fails", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const errorGetAllPaymentMethodsUseCase = {
      exec: vi
        .fn()
        .mockRejectedValue(new Error("Failed to fetch payment methods")),
    } as unknown as GetAllPaymentMethodsUseCase;

    render(
      <AuthProvider>
        <SettingsView
          getAllPaymentMethodsUseCase={errorGetAllPaymentMethodsUseCase}
          getUserPreferencesUseCase={mockGetUserPreferencesUseCase}
          saveUserPreferencesUseCase={mockSaveUserPreferencesUseCase}
          logoutUseCase={mockLogoutUseCase}
        />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error getting data.");
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });
});
