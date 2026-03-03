import { beforeEach, describe, expect, it, vi } from "vitest";
import * as wouter from "wouter";
import { usePaymentMethodStore } from "@payment-methods/infrastructure/usePaymentMethodStore";
import { fireEvent, render, screen, waitFor } from "@test/test-utils";

import { SavePaymentMethodUseCase } from "../../application/cases";
import { AddPaymentMethodView } from "./AddPaymentMethodView";

const mockSetLocation = vi.fn();

vi.mock("wouter", async () => {
  const actual = await vi.importActual<typeof wouter>("wouter");
  return { ...actual, useRoute: vi.fn(() => [true]), useLocation: vi.fn() };
});

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
    (wouter.useLocation as ReturnType<typeof vi.fn>).mockReturnValue([
      "/payment-methods/add",
      mockSetLocation,
    ]);
  });

  it("should render the add payment method form", () => {
    render(
      <AddPaymentMethodView
        savePaymentMethodUseCase={mockSavePaymentMethodUseCase}
      />,
    );
    expect(screen.getByTestId("add-payment-method-view")).toBeInTheDocument();
  });

  it("should call savePaymentMethodUseCase and redirect on successful submit", async () => {
    vi.mocked(mockSavePaymentMethodUseCase.exec).mockResolvedValue(undefined);

    const { container } = render(
      <AddPaymentMethodView
        savePaymentMethodUseCase={mockSavePaymentMethodUseCase}
      />,
    );

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Wallet" },
    });
    fireEvent.submit(container.querySelector("form")!);

    await waitFor(() => {
      expect(mockSavePaymentMethodUseCase.exec).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(mockSetLocation).toHaveBeenCalledWith(
        expect.stringContaining("/payment-methods"),
      );
    });
  });

  it("should show error message when savePaymentMethodUseCase throws", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    vi.mocked(mockSavePaymentMethodUseCase.exec).mockRejectedValue(
      new Error("Already exists"),
    );

    const { container } = render(
      <AddPaymentMethodView
        savePaymentMethodUseCase={mockSavePaymentMethodUseCase}
      />,
    );

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Duplicate" },
    });
    fireEvent.submit(container.querySelector("form")!);

    await waitFor(
      () => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    consoleErrorSpy.mockRestore();
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
});
