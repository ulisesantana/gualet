import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Id, PaymentMethod, UserPreferences } from "@domain/models";

import { SettingsView } from "./SettingsView";
import { GetUserPreferencesUseCase } from "../../application/get-user-preferences/get-user-preferences.use-case";
import { SaveUserPreferencesUseCase } from "../../application/save-user-preferences/save-user-preferences.use-case";
import { GetAllPaymentMethodsUseCase } from "../../../payment-methods/application/get-all-payment-methods/get-all-payment-methods.use-case";
import { LogoutUseCase } from "../../../auth/application/logout/logout.use-case";

const mockPaymentMethods = [
  new PaymentMethod({ id: new Id("1"), name: "Credit Card" }),
  new PaymentMethod({ id: new Id("2"), name: "Cash" }),
];

const mockPreferences: UserPreferences = {
  defaultPaymentMethod: mockPaymentMethods[0],
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
    Loader: () => <div>Loader</div>,
  })),
}));

vi.mock("@components", () => ({
  Loader: () => <div>Loader</div>,
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
      <SettingsView
        getAllPaymentMethodsUseCase={mockGetAllPaymentMethodsUseCase}
        getUserPreferencesUseCase={mockGetUserPreferencesUseCase}
        saveUserPreferencesUseCase={mockSaveUserPreferencesUseCase}
        logoutUseCase={mockLogoutUseCase}
      />,
    );
    expect(screen.getByText("Loader")).toBeInTheDocument();
  });

  it("renders settings options after loading", async () => {
    render(
      <SettingsView
        getAllPaymentMethodsUseCase={mockGetAllPaymentMethodsUseCase}
        getUserPreferencesUseCase={mockGetUserPreferencesUseCase}
        saveUserPreferencesUseCase={mockSaveUserPreferencesUseCase}
        logoutUseCase={mockLogoutUseCase}
      />,
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
      <SettingsView
        getAllPaymentMethodsUseCase={mockGetAllPaymentMethodsUseCase}
        getUserPreferencesUseCase={mockGetUserPreferencesUseCase}
        saveUserPreferencesUseCase={mockSaveUserPreferencesUseCase}
        logoutUseCase={mockLogoutUseCase}
      />,
    );

    await waitFor(() => {
      const dropdown = screen.getByTestId("select-default-payment-method");
      expect(dropdown).toHaveValue("1");
    });
  });

  it("changes and saves the default payment method", async () => {
    render(
      <SettingsView
        getAllPaymentMethodsUseCase={mockGetAllPaymentMethodsUseCase}
        getUserPreferencesUseCase={mockGetUserPreferencesUseCase}
        saveUserPreferencesUseCase={mockSaveUserPreferencesUseCase}
        logoutUseCase={mockLogoutUseCase}
      />,
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
      <SettingsView
        getAllPaymentMethodsUseCase={errorGetAllPaymentMethodsUseCase}
        getUserPreferencesUseCase={mockGetUserPreferencesUseCase}
        saveUserPreferencesUseCase={mockSaveUserPreferencesUseCase}
        logoutUseCase={mockLogoutUseCase}
      />,
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error getting data.");
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });
});
