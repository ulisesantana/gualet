import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { defaultTransactionConfig, TransactionConfig } from "@domain/models";
import { TransactionBuilder } from "@test/builders";
import { useLoader } from "@infrastructure/ui/hooks";
import { Router } from "wouter";
import { TestRouter } from "@test/TestRouter";
import { TransactionDetailsView } from "@views";
import userEvent from "@testing-library/user-event";

vi.mock("@infrastructure/ui/hooks", () => ({
  useLoader: vi.fn().mockReturnValue({
    isLoading: false,
    setIsLoading: vi.fn(),
    Loader: () => <div>Loader</div>,
  }),
}));

vi.mock("@components", () => ({
  Loader: () => <div>Loader</div>,
  EditTransactionForm: ({ transaction }: { transaction: any }) => (
    <div>Edit form for {transaction.description}</div>
  ),
}));

describe("TransactionDetailsView", () => {
  const mockTransaction = new TransactionBuilder()
    .withId("1")
    .withDescription("Test Transaction")
    .withAmount(100)
    .build();

  const mockConfig: TransactionConfig = {
    ...defaultTransactionConfig,
  };

  const mockSetIsLoading = vi.fn();

  // Mock use cases
  const mockGetTransactionUseCase = {
    exec: vi.fn().mockResolvedValue(mockTransaction),
  } as any;

  const mockGetTransactionConfigUseCase = {
    exec: vi.fn().mockResolvedValue(mockConfig),
  } as any;

  const mockSaveTransactionUseCase = {
    exec: vi.fn().mockResolvedValue(undefined),
  } as any;

  const mockRemoveTransactionUseCase = {
    exec: vi.fn().mockResolvedValue(undefined),
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
    (useLoader as Mock).mockReturnValue({
      isLoading: false,
      setIsLoading: mockSetIsLoading,
    });
  });

  it("renders Loader when loading is true", () => {
    (useLoader as Mock).mockReturnValueOnce({
      isLoading: true,
      setIsLoading: mockSetIsLoading,
      Loader: () => <div>Loader</div>,
    });

    render(
      <TransactionDetailsView
        getTransactionUseCase={mockGetTransactionUseCase}
        getTransactionConfigUseCase={mockGetTransactionConfigUseCase}
        saveTransactionUseCase={mockSaveTransactionUseCase}
        removeTransactionUseCase={mockRemoveTransactionUseCase}
      />,
    );
    expect(screen.getByText("Loader")).toBeInTheDocument();
  });

  it("renders transaction details and edit form after loading", async () => {
    render(
      <Router>
        <TestRouter path="/transactions/details/1" />
        <TransactionDetailsView
          getTransactionUseCase={mockGetTransactionUseCase}
          getTransactionConfigUseCase={mockGetTransactionConfigUseCase}
          saveTransactionUseCase={mockSaveTransactionUseCase}
          removeTransactionUseCase={mockRemoveTransactionUseCase}
        />
      </Router>,
    );

    await waitFor(() => {
      expect(
        screen.getByText("Edit form for Test Transaction"),
      ).toBeInTheDocument();
      expect(screen.getByText("🚮")).toBeInTheDocument(); // Remove button
    });
  });

  it("displays an error message if transaction is not found", async () => {
    (useLoader as Mock).mockReturnValueOnce({
      isReady: true,
      repositories: {
        transaction: {
          findById: vi.fn().mockResolvedValue(undefined),
          fetchTransactionConfig: vi.fn().mockResolvedValue(mockConfig),
        },
      },
      isLoading: false,
      setIsLoading: mockSetIsLoading,
    });

    render(
      <TransactionDetailsView
        getTransactionUseCase={mockGetTransactionUseCase}
        getTransactionConfigUseCase={mockGetTransactionConfigUseCase}
        saveTransactionUseCase={mockSaveTransactionUseCase}
        removeTransactionUseCase={mockRemoveTransactionUseCase}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("Transaction not found.")).toBeInTheDocument();
    });
  });

  it("calls remove method on transaction removal", async () => {
    const user = userEvent.setup();
    mockGetTransactionUseCase.exec.mockResolvedValueOnce(mockTransaction);

    render(
      <Router>
        <TestRouter path="/transactions/details/1" />
        <TransactionDetailsView
          getTransactionUseCase={mockGetTransactionUseCase}
          getTransactionConfigUseCase={mockGetTransactionConfigUseCase}
          saveTransactionUseCase={mockSaveTransactionUseCase}
          removeTransactionUseCase={mockRemoveTransactionUseCase}
        />
      </Router>,
    );

    await waitFor(() => {
      expect(
        screen.getByText("Edit form for Test Transaction"),
      ).toBeInTheDocument();
    });

    await user.click(screen.getByText("🚮"));

    await waitFor(() => {
      expect(mockRemoveTransactionUseCase.exec).toHaveBeenCalledWith(
        mockTransaction.id,
      );
    });
  });

  it("handles errors during data fetching gracefully", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockGetTransactionUseCase.exec.mockRejectedValueOnce(new Error("Boom!"));

    render(
      <TransactionDetailsView
        getTransactionUseCase={mockGetTransactionUseCase}
        getTransactionConfigUseCase={mockGetTransactionConfigUseCase}
        saveTransactionUseCase={mockSaveTransactionUseCase}
        removeTransactionUseCase={mockRemoveTransactionUseCase}
      />,
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error getting data");
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });
});
