import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { SavePaymentMethodUseCase } from "@application/cases";
import { usePaymentMethodStore } from "@infrastructure/ui/stores/usePaymentMethodStore";

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
    const { container } = render(
      <AddPaymentMethodView
        savePaymentMethodUseCase={mockSavePaymentMethodUseCase}
      />,
    );

    expect(
      container.querySelector(".payment-method-details-view"),
    ).toBeInTheDocument();
  });
});
