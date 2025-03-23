import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  Day,
  defaultPaymentMethods,
  defaultTransactionConfig,
  Id,
  PaymentMethod,
  Transaction,
  TransactionConfig,
  UserPreferences,
} from "@domain/models";
import { useRepositories } from "@infrastructure/ui/hooks";
import { LastTransactionsView } from "@views";
import { TransactionBuilder } from "@test/builders";

vi.mock("@infrastructure/ui/hooks", () => ({
  useRepositories: vi.fn(),
}));

vi.mock("@components", () => ({
  Loader: () => <div>Loader</div>,
  AddTransactionForm: ({
    onSubmit,
  }: {
    onSubmit: (transaction: Transaction) => void;
  }) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(
          new TransactionBuilder()
            .withId(new Id("3"))
            .withDescription("New Transaction")
            .withDate(new Day("2024-02-03"))
            .build(),
        );
      }}
    >
      <button type="submit" name="add-transaction">
        Add Transaction
      </button>
    </form>
  ),
  TransactionList: ({ transactions }: { transactions: Transaction[] }) => (
    <ul>
      {transactions.map((transaction) => (
        <li key={transaction.id.toString()}>{transaction.description}</li>
      ))}
    </ul>
  ),
}));

describe("LastTransactionsView", () => {
  const mockTransactions = [
    new TransactionBuilder()
      .withId(new Id("1"))
      .withDescription("Transaction 1")
      .withDate(new Day("2023-10-08"))
      .build(),
    new TransactionBuilder()
      .withId(new Id("2"))
      .withDescription("Transaction 2")
      .withDate(new Day("2023-10-10"))
      .build(),
  ];
  const mockConfig: TransactionConfig = {
    ...defaultTransactionConfig,
  };
  const mockPreferences: UserPreferences = {
    defaultPaymentMethod: new PaymentMethod({ ...defaultPaymentMethods[0] }),
  };

  const mockSetIsLoading = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRepositories as Mock).mockReturnValue({
      isReady: true,
      repositories: {
        transaction: {
          findLast: vi.fn().mockResolvedValue(mockTransactions),
          fetchTransactionConfig: vi.fn().mockResolvedValue(mockConfig),
          save: vi.fn(),
        },
        userPreferences: {
          find: vi.fn().mockResolvedValue(mockPreferences),
        },
      },
      isLoading: false,
      setIsLoading: mockSetIsLoading,
    });
  });

  it("renders Loader when loading is true", async () => {
    (useRepositories as Mock).mockReturnValueOnce({
      isLoading: true,
    });

    render(<LastTransactionsView />);

    expect(screen.getByText("Loader")).toBeInTheDocument();
  });

  it("renders AddTransactionForm and TransactionList after loading", async () => {
    render(<LastTransactionsView />);

    await waitFor(() => {
      expect(screen.getByText("Add Transaction")).toBeInTheDocument();
      const list = screen.getByRole("list");
      expect(list.children[0].textContent).toBe("Transaction 2");
      expect(list.children[1].textContent).toBe("Transaction 1");
    });
  });

  it("fetches transactions, config, and preferences on load", async () => {
    render(<LastTransactionsView />);

    await waitFor(() => {
      const { transaction, userPreferences } = useRepositories().repositories!;
      expect(transaction.findLast).toHaveBeenCalledWith(25);
      expect(transaction.fetchTransactionConfig).toHaveBeenCalled();
      expect(userPreferences.find).toHaveBeenCalled();
    });
  });

  it("calls transaction.save and updates transactions on form submit", async () => {
    const { transaction } = useRepositories().repositories!;
    render(<LastTransactionsView />);

    await waitFor(() => {
      fireEvent.click(screen.getByText("Add Transaction"));
    });

    await waitFor(() => {
      expect(transaction.save).toHaveBeenCalled();
      const list = screen.getByRole("list");
      expect(list.children.length).toBe(3);
      expect(list.children[0].textContent).toBe("New Transaction");
      expect(list.children[1].textContent).toBe("Transaction 2");
      expect(list.children[2].textContent).toBe("Transaction 1");
    });
  });

  it("handles errors when fetching data", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    (useRepositories as Mock).mockReturnValueOnce({
      isReady: true,
      repositories: {
        transaction: {
          findLast: vi
            .fn()
            .mockRejectedValue(new Error("Failed to fetch transactions")),
          fetchTransactionConfig: vi
            .fn()
            .mockRejectedValue(new Error("Failed to fetch config")),
          save: vi.fn(),
        },
        userPreferences: {
          find: vi
            .fn()
            .mockRejectedValue(new Error("Failed to fetch preferences")),
        },
      },
      isLoading: false,
      setIsLoading: mockSetIsLoading,
    });

    render(<LastTransactionsView />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error getting last transactions",
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });
});
