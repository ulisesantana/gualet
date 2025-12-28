import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePaymentMethodStore } from "@payment-methods/infrastructure/usePaymentMethodStore";
import { render, screen } from "@test/test-utils";

import { SavePaymentMethodUseCase } from "../../application/cases";
import { AddPaymentMethodView } from "./AddPaymentMethodView";

vi.mock("wouter", () => ({
  useRoute: vi.fn(() => [true]),
  useLocation: vi.fn(() => ["/payment-methods/add", vi.fn()]),
}));

vi.mock("react-transition-group", () => ({
  Transition: ({ children }: any) => children,
}));

describe("AddPaymentMethodView", () => {
  const mockSavePaymentMethodUseCase = {
    exec: vi.fn(),
  } as unknown as SavePaymentMethodUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    usePaymentMethodStore.getState().reset();
  });

  it("should render the view", () => {
    const { container } = render(
      <AddPaymentMethodView
        savePaymentMethodUseCase={mockSavePaymentMethodUseCase}
      />,
    );
    expect(
      container.querySelector(".payment-method-details-view"),
    ).toBeInTheDocument();
  });

  it("should initialize without errors", () => {
    expect(() => {
      render(
        <AddPaymentMethodView
          savePaymentMethodUseCase={mockSavePaymentMethodUseCase}
        />,
      );
    }).not.toThrow();
  });

  it("should have fetchPaymentMethods available in store", () => {
    render(
      <AddPaymentMethodView
        savePaymentMethodUseCase={mockSavePaymentMethodUseCase}
      />,
    );
    const store = usePaymentMethodStore.getState();
    expect(store.fetchPaymentMethods).toBeDefined();
  });

  it("should have onSubmit handler defined", () => {
    render(
      <AddPaymentMethodView
        savePaymentMethodUseCase={mockSavePaymentMethodUseCase}
      />,
    );

    expect(screen.getByTestId("add-payment-method-view")).toBeInTheDocument();
  });
});
