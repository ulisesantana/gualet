import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { defaultTransactionConfig, TransactionConfig } from "@domain/models";
import { TransactionBuilder } from "@test/builders";
import { useLoader } from "@common/infrastructure/hooks";
import { Router } from "wouter";
import { TestRouter } from "@test/TestRouter";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@test/test-utils";

import { TransactionDetailsView } from "./TransactionDetailsView";

const mockTransactionStore = {
  transactions: [],
  isLoading: false,
  currentTransaction: null as any,
  fetchLastTransactions: vi.fn(),
  fetchTransaction: vi.fn(),
  saveTransaction: vi.fn(),
  removeTransaction: vi.fn(),
  reset: vi.fn(),
};

vi.mock("@features/transactions", async () => {
  const actual = await vi.importActual("@features/transactions");
  return {
    ...actual,
    useTransactionStore: vi.fn((selector) => {
      if (typeof selector === "function") {
        return selector(mockTransactionStore);
      }
      return mockTransactionStore;
    }),
    setUseCases: vi.fn(),
  };
});

vi.mock("@common/infrastructure/hooks", () => ({
  useLoader: vi.fn().mockReturnValue({
    isLoading: false,
    setIsLoading: vi.fn(),
    Loader: () => <div>Loader</div>,
  }),
}));

vi.mock("../TransactionForm", () => ({
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
  const mockGetLastTransactionsUseCase = {
    exec: vi.fn().mockResolvedValue([mockTransaction]),
  } as any;

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

    // Reset mock store
    mockTransactionStore.transactions = [];
    mockTransactionStore.isLoading = false;
    mockTransactionStore.currentTransaction = null;

    // Make fetchTransaction set currentTransaction
    mockTransactionStore.fetchTransaction.mockImplementation((id) => {
      if (mockTransaction && id.toString() === mockTransaction.id.toString()) {
        mockTransactionStore.currentTransaction = mockTransaction;
      }
    });

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
        getLastTransactionsUseCase={mockGetLastTransactionsUseCase}
        getTransactionUseCase={mockGetTransactionUseCase}
        getTransactionConfigUseCase={mockGetTransactionConfigUseCase}
        saveTransactionUseCase={mockSaveTransactionUseCase}
        removeTransactionUseCase={mockRemoveTransactionUseCase}
      />,
    );
    expect(screen.getByText("Loader")).toBeInTheDocument();
  });

  it("renders transaction details and edit form after loading", async () => {
    // Set the current transaction in the store
    mockTransactionStore.currentTransaction = mockTransaction;
    mockGetTransactionConfigUseCase.exec.mockResolvedValueOnce(mockConfig);

    render(
      <Router>
        <TestRouter path="/transactions/details/1" />
        <TransactionDetailsView
          getLastTransactionsUseCase={mockGetLastTransactionsUseCase}
          getTransactionUseCase={mockGetTransactionUseCase}
          getTransactionConfigUseCase={mockGetTransactionConfigUseCase}
          saveTransactionUseCase={mockSaveTransactionUseCase}
          removeTransactionUseCase={mockRemoveTransactionUseCase}
        />
      </Router>,
    );

    // Wait for async operations
    await waitFor(() => {
      expect(mockGetTransactionConfigUseCase.exec).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(
        screen.getByText("Edit form for Test Transaction"),
      ).toBeInTheDocument();
      expect(screen.getByText("🚮")).toBeInTheDocument(); // Remove button
    });
  });

  it("displays an error message if transaction is not found", async () => {
    mockGetTransactionUseCase.exec.mockResolvedValueOnce(null);

    render(
      <Router>
        <TestRouter path="/transactions/details/1" />
        <TransactionDetailsView
          getLastTransactionsUseCase={mockGetLastTransactionsUseCase}
          getTransactionUseCase={mockGetTransactionUseCase}
          getTransactionConfigUseCase={mockGetTransactionConfigUseCase}
          saveTransactionUseCase={mockSaveTransactionUseCase}
          removeTransactionUseCase={mockRemoveTransactionUseCase}
        />
      </Router>,
    );

    // Wait for async operations
    await waitFor(() => {
      expect(mockGetTransactionConfigUseCase.exec).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText("Transaction not found.")).toBeInTheDocument();
    });
  });

  it("calls remove method on transaction removal", async () => {
    const user = userEvent.setup();

    render(
      <Router>
        <TestRouter path="/transactions/details/1" />
        <TransactionDetailsView
          getLastTransactionsUseCase={mockGetLastTransactionsUseCase}
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

    const errorGetTransactionConfigUseCase = {
      exec: vi.fn().mockRejectedValue(new Error("Boom!")),
    } as any;

    render(
      <Router>
        <TestRouter path="/transactions/details/1" />
        <TransactionDetailsView
          getLastTransactionsUseCase={mockGetLastTransactionsUseCase}
          getTransactionUseCase={mockGetTransactionUseCase}
          getTransactionConfigUseCase={errorGetTransactionConfigUseCase}
          saveTransactionUseCase={mockSaveTransactionUseCase}
          removeTransactionUseCase={mockRemoveTransactionUseCase}
        />
      </Router>,
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error getting transaction config",
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });
});
