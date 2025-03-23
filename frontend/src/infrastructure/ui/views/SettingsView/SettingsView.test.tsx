import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useRepositories } from "@infrastructure/ui/hooks";
import { Id, PaymentMethod, UserPreferences } from "@domain/models";
import { SettingsView } from "@views";

vi.mock("@infrastructure/ui/hooks", () => ({
  useRepositories: vi.fn(),
}));

vi.mock("@components", () => ({
  Loader: () => <div>Loader</div>,
  LogoutButton: () => <button>Logout</button>,
}));

describe("SettingsView", () => {
  const mockPaymentMethods = [
    new PaymentMethod({ id: new Id("1"), name: "Credit Card" }),
    new PaymentMethod({ id: new Id("2"), name: "Cash" }),
  ];
  const mockPreferences: UserPreferences = {
    defaultPaymentMethod: mockPaymentMethods[0],
  };

  const mockSetIsLoading = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRepositories as Mock).mockReturnValue({
      isReady: true,
      repositories: {
        paymentMethod: {
          findAll: vi.fn().mockResolvedValue(mockPaymentMethods),
        },
        userPreferences: {
          find: vi.fn().mockResolvedValue(mockPreferences),
          save: vi.fn().mockResolvedValue(null),
        },
      },
      isLoading: false,
      setIsLoading: mockSetIsLoading,
    });
  });

  it("renders Loader when loading is true", () => {
    (useRepositories as Mock).mockReturnValueOnce({
      isLoading: true,
    });

    render(<SettingsView />);
    expect(screen.getByText("Loader")).toBeInTheDocument();
  });

  it("renders settings options after loading", async () => {
    render(<SettingsView />);

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
    render(<SettingsView />);

    await waitFor(() => {
      const dropdown = screen.getByTestId("select-default-payment-method");
      expect(dropdown).toHaveValue("1"); // ID of "Credit Card" as default
    });
  });

  it("changes and saves the default payment method", async () => {
    const { userPreferences } = useRepositories().repositories!;

    render(<SettingsView />);

    await waitFor(() => {
      expect(
        screen.getByTestId("select-default-payment-method"),
      ).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId("select-default-payment-method"), {
      target: { value: "2" }, // ID of "Cash"
    });

    await waitFor(() => {
      expect(userPreferences.save).toHaveBeenCalledWith({
        defaultPaymentMethod: mockPaymentMethods[1],
      });
    });
  });

  it("logs an error if fetching data fails", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    (useRepositories as Mock).mockReturnValueOnce({
      isReady: true,
      repositories: {
        paymentMethod: {
          findAll: vi
            .fn()
            .mockRejectedValue(new Error("Failed to fetch payment methods")),
        },
        userPreferences: {
          find: vi
            .fn()
            .mockRejectedValue(new Error("Failed to fetch preferences")),
          save: vi.fn(),
        },
      },
      isLoading: false,
      setIsLoading: mockSetIsLoading,
    });

    render(<SettingsView />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error getting data.");
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });
});
