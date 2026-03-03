import { beforeEach, describe, expect, it, vi } from "vitest";
import * as wouter from "wouter";
import { Id, PaymentMethod } from "@gualet/shared";
import { fireEvent, render, screen, waitFor } from "@test/test-utils";

import { PaymentMethodCard } from "./PaymentMethodCard";

const mockSetLocation = vi.fn();

vi.mock("wouter", async () => {
  const actual = await vi.importActual<typeof wouter>("wouter");
  return { ...actual, useLocation: vi.fn() };
});

describe("PaymentMethodCard", () => {
  const mockPaymentMethod = new PaymentMethod({
    id: new Id("pm-1"),
    name: "Credit Card",
    icon: "💳",
    color: "#FF5733",
  });

  beforeEach(() => {
    vi.clearAllMocks();
    global.confirm = vi.fn(() => true);
    global.alert = vi.fn();
    (wouter.useLocation as ReturnType<typeof vi.fn>).mockReturnValue([
      "/payment-methods",
      mockSetLocation,
    ]);
  });

  it("should render payment method card with name", () => {
    render(<PaymentMethodCard paymentMethod={mockPaymentMethod} />);

    expect(screen.getByText("Credit Card")).toBeInTheDocument();
  });

  it("should show payment method icon", () => {
    render(<PaymentMethodCard paymentMethod={mockPaymentMethod} />);

    expect(screen.getByText("💳")).toBeInTheDocument();
  });

  it("should show default icon when icon is not provided", () => {
    const pmWithoutIcon = new PaymentMethod({
      id: new Id("pm-2"),
      name: "Cash",
      color: "#33FF57",
    });

    render(<PaymentMethodCard paymentMethod={pmWithoutIcon} />);

    expect(screen.getByText("💳")).toBeInTheDocument();
  });

  it("should show edit button", () => {
    render(<PaymentMethodCard paymentMethod={mockPaymentMethod} />);

    const editButton = screen.getByRole("button", { name: /edit/i });
    expect(editButton).toBeInTheDocument();
  });

  it("should show delete button when onDelete is provided", () => {
    const onDelete = vi.fn();
    render(
      <PaymentMethodCard
        paymentMethod={mockPaymentMethod}
        onDelete={onDelete}
      />,
    );

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    expect(deleteButton).toBeInTheDocument();
  });

  it("should not show delete button when onDelete is not provided", () => {
    render(<PaymentMethodCard paymentMethod={mockPaymentMethod} />);

    const deleteButton = screen.queryByRole("button", { name: /delete/i });
    expect(deleteButton).not.toBeInTheDocument();
  });

  it("should call onDelete when delete button is clicked and confirmed", async () => {
    const onDelete = vi.fn().mockResolvedValue(undefined);
    render(
      <PaymentMethodCard
        paymentMethod={mockPaymentMethod}
        onDelete={onDelete}
      />,
    );

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledWith("pm-1");
    });
  });

  it("should not call onDelete when delete is cancelled", () => {
    global.confirm = vi.fn(() => false);
    const onDelete = vi.fn();
    render(
      <PaymentMethodCard
        paymentMethod={mockPaymentMethod}
        onDelete={onDelete}
      />,
    );

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(onDelete).not.toHaveBeenCalled();
  });

  it("should handle delete error and show alert", async () => {
    const onDelete = vi
      .fn()
      .mockRejectedValue(new Error("Payment method in use"));
    render(
      <PaymentMethodCard
        paymentMethod={mockPaymentMethod}
        onDelete={onDelete}
      />,
    );

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(
        expect.stringContaining("Failed to delete payment method"),
      );
    });
  });

  it("should show loading state while deleting", async () => {
    const onDelete = vi.fn(
      () =>
        new Promise((resolve) => {
          setTimeout(resolve, 100);
        }) as Promise<void>,
    );
    render(
      <PaymentMethodCard
        paymentMethod={mockPaymentMethod}
        onDelete={onDelete}
      />,
    );

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteButton).toHaveTextContent("⏳");
    });
  });

  it("should navigate to the payment method details page when edit is clicked", () => {
    render(<PaymentMethodCard paymentMethod={mockPaymentMethod} />);

    const editButton = screen.getByRole("button", { name: /edit/i });
    fireEvent.click(editButton);

    expect(mockSetLocation).toHaveBeenCalledWith(
      expect.stringContaining("pm-1"),
    );
  });
});
