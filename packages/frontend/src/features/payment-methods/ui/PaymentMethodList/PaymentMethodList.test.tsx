import { beforeEach, describe, expect, it, vi } from "vitest";
import { Id, PaymentMethod } from "@gualet/shared";
import { fireEvent, render, screen, waitFor } from "@test/test-utils";

import { PaymentMethodList } from "./PaymentMethodList";

vi.mock("wouter", () => ({
  useLocation: vi.fn(() => ["/payment-methods", vi.fn()]),
}));

describe("PaymentMethodList", () => {
  const mockPaymentMethods = [
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
    global.confirm = vi.fn(() => true);
    global.alert = vi.fn();
    vi.clearAllMocks();
  });

  it("renders a list of PaymentMethodCard components for each payment method", () => {
    render(<PaymentMethodList paymentMethods={mockPaymentMethods} />);

    expect(screen.getByText("Credit Card")).toBeInTheDocument();
    expect(screen.getByText("Cash")).toBeInTheDocument();
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(mockPaymentMethods.length);
  });

  it("displays a message when there are no payment methods", () => {
    render(<PaymentMethodList paymentMethods={[]} />);

    expect(
      screen.getByText("There are no payment methods"),
    ).toBeInTheDocument();
  });

  it("assigns correct data-testid to each list item", () => {
    render(<PaymentMethodList paymentMethods={mockPaymentMethods} />);

    mockPaymentMethods.forEach((pm) => {
      const listItem = screen.queryByTestId(`payment-method-item-${pm.id}`);
      expect(listItem).not.toBeNull();
    });
  });

  it("passes onDeletePaymentMethod to each PaymentMethodCard", async () => {
    const onDeletePaymentMethod = vi.fn().mockResolvedValue(undefined);
    render(
      <PaymentMethodList
        paymentMethods={mockPaymentMethods}
        onDeletePaymentMethod={onDeletePaymentMethod}
      />,
    );

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    expect(deleteButtons).toHaveLength(mockPaymentMethods.length);

    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(onDeletePaymentMethod).toHaveBeenCalledWith("pm-1");
    });
  });

  it("renders without onDeletePaymentMethod (no delete buttons shown)", () => {
    render(<PaymentMethodList paymentMethods={mockPaymentMethods} />);

    const deleteButtons = screen.queryAllByRole("button", { name: /delete/i });
    expect(deleteButtons).toHaveLength(0);
  });
});
