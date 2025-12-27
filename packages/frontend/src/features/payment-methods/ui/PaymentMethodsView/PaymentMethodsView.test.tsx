import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Id, PaymentMethod } from "@gualet/shared";
import { usePaymentMethodStore } from "@payment-methods/infrastructure/usePaymentMethodStore";

import {
  DeletePaymentMethodUseCase,
  GetAllPaymentMethodsUseCase,
} from "../../application/cases";
import { PaymentMethodsView } from "./PaymentMethodsView"; // Mock wouter - MUST BE BEFORE component imports

// Mock wouter - MUST BE BEFORE component imports
vi.mock("wouter", () => ({
  useLocation: () => ["/payment-methods", vi.fn()],
}));

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
});
