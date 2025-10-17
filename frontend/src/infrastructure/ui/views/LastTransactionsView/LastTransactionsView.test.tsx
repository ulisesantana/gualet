import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  Day,
  defaultTransactionConfig,
  generateDefaultPaymentMethods,
  Id,
  PaymentMethod,
  Transaction,
  TransactionConfig,
  UserPreferences,
} from "@gualet/core";
import { LastTransactionsView } from "@views";
import { TransactionBuilder } from "@test/builders";
import {
  GetLastTransactionsUseCase,
  GetTransactionConfigUseCase,
  GetUserPreferencesUseCase,
  SaveTransactionUseCase,
} from "@application/cases";

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
  defaultPaymentMethod: new PaymentMethod({
    ...generateDefaultPaymentMethods()[0],
  }),
};

const mockGetLastTransactionsUseCase = {
  exec: vi.fn().mockResolvedValue(mockTransactions),
} as unknown as GetLastTransactionsUseCase;

const mockGetTransactionConfigUseCase = {
  exec: vi.fn().mockResolvedValue(mockConfig),
} as unknown as GetTransactionConfigUseCase;

const mockGetUserPreferencesUseCase = {
  exec: vi.fn().mockResolvedValue(mockPreferences),
} as unknown as GetUserPreferencesUseCase;

const mockSaveTransactionUseCase = {
  exec: vi
    .fn()
    .mockResolvedValue(new TransactionBuilder().withId(new Id("3")).build()),
} as unknown as SaveTransactionUseCase;

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
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders Loader when loading is true", async () => {
    render(
      <LastTransactionsView
        getLastTransactionsUseCase={mockGetLastTransactionsUseCase}
        getTransactionConfigUseCase={mockGetTransactionConfigUseCase}
        getUserPreferencesUseCase={mockGetUserPreferencesUseCase}
        saveTransactionUseCase={mockSaveTransactionUseCase}
      />,
    );

    expect(screen.getByText("Loader")).toBeInTheDocument();
  });

  it("renders AddTransactionForm and TransactionList after loading", async () => {
    render(
      <LastTransactionsView
        getLastTransactionsUseCase={mockGetLastTransactionsUseCase}
        getTransactionConfigUseCase={mockGetTransactionConfigUseCase}
        getUserPreferencesUseCase={mockGetUserPreferencesUseCase}
        saveTransactionUseCase={mockSaveTransactionUseCase}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("Add Transaction")).toBeInTheDocument();
      const list = screen.getByRole("list");
      expect(list.children[0].textContent).toBe("Transaction 2");
      expect(list.children[1].textContent).toBe("Transaction 1");
    });
  });

  it("fetches transactions, config, and preferences on load", async () => {
    render(
      <LastTransactionsView
        getLastTransactionsUseCase={mockGetLastTransactionsUseCase}
        getTransactionConfigUseCase={mockGetTransactionConfigUseCase}
        getUserPreferencesUseCase={mockGetUserPreferencesUseCase}
        saveTransactionUseCase={mockSaveTransactionUseCase}
      />,
    );

    await waitFor(() => {
      expect(mockGetLastTransactionsUseCase.exec).toHaveBeenCalledWith(25);
      expect(mockGetTransactionConfigUseCase.exec).toHaveBeenCalled();
      expect(mockGetUserPreferencesUseCase.exec).toHaveBeenCalled();
    });
  });

  it("calls transaction.save and updates transactions on form submit", async () => {
    render(
      <LastTransactionsView
        getLastTransactionsUseCase={mockGetLastTransactionsUseCase}
        getTransactionConfigUseCase={mockGetTransactionConfigUseCase}
        getUserPreferencesUseCase={mockGetUserPreferencesUseCase}
        saveTransactionUseCase={mockSaveTransactionUseCase}
      />,
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText("Add Transaction"));
    });

    await waitFor(() => {
      expect(mockSaveTransactionUseCase.exec).toHaveBeenCalled();
      const list = screen.getByRole("list");
      expect(list.children.length).toBe(3);
      expect(list.children[0].textContent).toBe("New Transaction");
    });
  });

  it("handles errors when fetching data", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const errorGetLastTransactionsUseCase = {
      exec: vi
        .fn()
        .mockRejectedValue(new Error("Failed to fetch transactions")),
    } as unknown as GetLastTransactionsUseCase;

    render(
      <LastTransactionsView
        getLastTransactionsUseCase={errorGetLastTransactionsUseCase}
        getTransactionConfigUseCase={mockGetTransactionConfigUseCase}
        getUserPreferencesUseCase={mockGetUserPreferencesUseCase}
        saveTransactionUseCase={mockSaveTransactionUseCase}
      />,
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error getting last transactions",
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });
});
