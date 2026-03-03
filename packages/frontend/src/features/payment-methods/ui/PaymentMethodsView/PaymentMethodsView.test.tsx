import { beforeEach, describe, expect, it, vi } from "vitest";
import * as wouter from "wouter";
import { Id, PaymentMethod } from "@gualet/shared";
import { usePaymentMethodStore } from "@payment-methods/infrastructure/usePaymentMethodStore";
import { fireEvent, render, screen, waitFor } from "@test/test-utils";

import {
  DeletePaymentMethodUseCase,
  GetAllPaymentMethodsUseCase,
} from "../../application/cases";
import { PaymentMethodsView } from "./PaymentMethodsView";

const mockSetLocation = vi.fn();

vi.mock("wouter", async () => {
  const actual = await vi.importActual<typeof wouter>("wouter");
  return { ...actual, useLocation: vi.fn() };
});

describe("PaymentMethodsView", () => {
  const mockGetAllPaymentMethodsUseCase = {
    exec: vi.fn(),
  } as unknown as GetAllPaymentMethodsUseCase;

  const mockDeletePaymentMethodUseCase = {
    exec: vi.fn(),
  } as unknown as DeletePaymentMethodUseCase;

  const mockPaymentMethods: PaymentMethod[] = [
    new PaymentMethod({
      id: new Id("pm-1"),
      name: "Credit Card",
      icon: "💳",
      color: "#FF5733",
    }),
    new PaymentMethod({
      id: new Id("pm-2"),
      name: "Cash",
      icon: "💵",
      color: "#33FF57",
    }),
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    usePaymentMethodStore.getState().reset();
    (wouter.useLocation as ReturnType<typeof vi.fn>).mockReturnValue([
      "/payment-methods",
      mockSetLocation,
    ]);
  });

  it("should render the view", () => {
    vi.mocked(mockGetAllPaymentMethodsUseCase.exec).mockResolvedValue([]);

    const { container } = render(
      <PaymentMethodsView
        getAllPaymentMethodsUseCase={mockGetAllPaymentMethodsUseCase}
        deletePaymentMethodUseCase={mockDeletePaymentMethodUseCase}
      />,
    );

    expect(
      container.querySelector(".payment-methods-view"),
    ).toBeInTheDocument();
  });

  it("should have add payment method button", async () => {
    vi.mocked(mockGetAllPaymentMethodsUseCase.exec).mockResolvedValue([]);

    render(
      <PaymentMethodsView
        getAllPaymentMethodsUseCase={mockGetAllPaymentMethodsUseCase}
        deletePaymentMethodUseCase={mockDeletePaymentMethodUseCase}
      />,
    );

    await waitFor(() => {
      const addButton = screen.queryByText(/add payment method/i);
      expect(addButton).toBeInTheDocument();
    });
  });

  it("should render loader while fetching", () => {
    // Set store to loading state
    const store = usePaymentMethodStore.getState();
    store.isLoading = true;

    render(
      <PaymentMethodsView
        getAllPaymentMethodsUseCase={mockGetAllPaymentMethodsUseCase}
        deletePaymentMethodUseCase={mockDeletePaymentMethodUseCase}
      />,
    );

    expect(screen.getByTestId("loader-container")).toBeInTheDocument();
  });

  it("should display payment methods when loaded", async () => {
    vi.mocked(mockGetAllPaymentMethodsUseCase.exec).mockResolvedValue(
      mockPaymentMethods,
    );

    render(
      <PaymentMethodsView
        getAllPaymentMethodsUseCase={mockGetAllPaymentMethodsUseCase}
        deletePaymentMethodUseCase={mockDeletePaymentMethodUseCase}
      />,
    );

    await waitFor(() => {
      expect(screen.queryByText("Credit Card")).toBeInTheDocument();
      expect(screen.queryByText("Cash")).toBeInTheDocument();
    });
  });

  it("should navigate to add payment method page when add button is clicked", async () => {
    vi.mocked(mockGetAllPaymentMethodsUseCase.exec).mockResolvedValue([]);

    render(
      <PaymentMethodsView
        getAllPaymentMethodsUseCase={mockGetAllPaymentMethodsUseCase}
        deletePaymentMethodUseCase={mockDeletePaymentMethodUseCase}
      />,
    );

    await waitFor(() => {
      const addButton = screen.getByRole("button", {
        name: /add new payment method/i,
      });
      fireEvent.click(addButton);
    });

    expect(mockSetLocation).toHaveBeenCalledWith(
      expect.stringContaining("add"),
    );
  });

  it("should handle delete payment method error gracefully", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    vi.mocked(mockGetAllPaymentMethodsUseCase.exec).mockResolvedValue(
      mockPaymentMethods,
    );

    const store = usePaymentMethodStore.getState();
    store.isLoading = false;
    store.paymentMethods = mockPaymentMethods;
    // Make deletePaymentMethod throw so the catch in handleDeletePaymentMethod runs
    store.deletePaymentMethod = vi
      .fn()
      .mockRejectedValueOnce(new Error("Delete failed"));

    render(
      <PaymentMethodsView
        getAllPaymentMethodsUseCase={mockGetAllPaymentMethodsUseCase}
        deletePaymentMethodUseCase={mockDeletePaymentMethodUseCase}
      />,
    );

    await waitFor(() => {
      expect(screen.queryByText("Credit Card")).toBeInTheDocument();
    });

    // Click delete and confirm
    global.confirm = vi.fn(() => true);
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    if (deleteButtons.length > 0) {
      fireEvent.click(deleteButtons[0]);
    }

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });
});
