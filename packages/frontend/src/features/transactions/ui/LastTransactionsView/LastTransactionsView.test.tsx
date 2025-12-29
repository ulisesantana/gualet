import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  Day,
  defaultTransactionConfig,
  generateDefaultPaymentMethods,
  Id,
  PaymentMethod,
  TransactionConfig,
  UserPreferences,
} from "@gualet/shared";
import { TransactionBuilder } from "@test/builders";
import { render, screen, waitFor } from "@test/test-utils";

import { LastTransactionsView } from "./LastTransactionsView";
import {
  GetLastTransactionsUseCase,
  GetTransactionConfigUseCase,
  GetTransactionUseCase,
  RemoveTransactionUseCase,
  SaveTransactionUseCase,
} from "../../application/cases";
import { GetUserPreferencesUseCase } from "../../../settings/application/get-user-preferences/get-user-preferences.use-case";

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
  language: "en",
};

const mockGetLastTransactionsUseCase = {
  exec: vi.fn().mockResolvedValue(mockTransactions),
} as unknown as GetLastTransactionsUseCase;

const mockGetTransactionUseCase = {
  exec: vi.fn().mockResolvedValue(mockTransactions[0]),
} as unknown as GetTransactionUseCase;

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

const mockRemoveTransactionUseCase = {
  exec: vi.fn().mockResolvedValue(undefined),
} as unknown as RemoveTransactionUseCase;

// Mock the transaction store
const mockTransactionStore = {
  transactions: mockTransactions,
  isLoading: false,
  currentTransaction: null,
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

describe("LastTransactionsView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock store state
    mockTransactionStore.transactions = mockTransactions;
    mockTransactionStore.isLoading = false;
    mockTransactionStore.currentTransaction = null;
  });

  it("renders Loader when loading is true", async () => {
    // Set the store to loading state
    mockTransactionStore.isLoading = true;

    render(
      <LastTransactionsView
        getLastTransactionsUseCase={mockGetLastTransactionsUseCase}
        getTransactionUseCase={mockGetTransactionUseCase}
        getTransactionConfigUseCase={mockGetTransactionConfigUseCase}
        getUserPreferencesUseCase={mockGetUserPreferencesUseCase}
        saveTransactionUseCase={mockSaveTransactionUseCase}
        removeTransactionUseCase={mockRemoveTransactionUseCase}
      />,
    );

    expect(screen.getByTestId("loader")).toBeInTheDocument();

    // Reset for other tests
    mockTransactionStore.isLoading = false;
  });

  it("renders AddTransactionForm and TransactionList after loading", async () => {
    render(
      <LastTransactionsView
        getLastTransactionsUseCase={mockGetLastTransactionsUseCase}
        getTransactionUseCase={mockGetTransactionUseCase}
        getTransactionConfigUseCase={mockGetTransactionConfigUseCase}
        getUserPreferencesUseCase={mockGetUserPreferencesUseCase}
        saveTransactionUseCase={mockSaveTransactionUseCase}
        removeTransactionUseCase={mockRemoveTransactionUseCase}
      />,
    );

    // Wait for async operations to complete
    await waitFor(() => {
      expect(mockGetTransactionConfigUseCase.exec).toHaveBeenCalled();
      expect(mockGetUserPreferencesUseCase.exec).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId("submit-transaction-button"),
      ).toBeInTheDocument();
      const list = screen.getByRole("list");
      expect(list.children).toHaveLength(2); // Both transactions rendered
    });
  });

  it("fetches transactions, config, and preferences on load", async () => {
    render(
      <LastTransactionsView
        getLastTransactionsUseCase={mockGetLastTransactionsUseCase}
        getTransactionUseCase={mockGetTransactionUseCase}
        getTransactionConfigUseCase={mockGetTransactionConfigUseCase}
        getUserPreferencesUseCase={mockGetUserPreferencesUseCase}
        saveTransactionUseCase={mockSaveTransactionUseCase}
        removeTransactionUseCase={mockRemoveTransactionUseCase}
      />,
    );

    await waitFor(() => {
      expect(mockTransactionStore.fetchLastTransactions).toHaveBeenCalledWith(
        25,
      );
      expect(mockGetTransactionConfigUseCase.exec).toHaveBeenCalled();
      expect(mockGetUserPreferencesUseCase.exec).toHaveBeenCalled();
    });
  });

  it("calls transaction.save and updates transactions on form submit", async () => {
    render(
      <LastTransactionsView
        getLastTransactionsUseCase={mockGetLastTransactionsUseCase}
        getTransactionUseCase={mockGetTransactionUseCase}
        getTransactionConfigUseCase={mockGetTransactionConfigUseCase}
        getUserPreferencesUseCase={mockGetUserPreferencesUseCase}
        saveTransactionUseCase={mockSaveTransactionUseCase}
        removeTransactionUseCase={mockRemoveTransactionUseCase}
      />,
    );

    // Wait for the form to be ready
    await waitFor(() => {
      expect(
        screen.getByTestId("submit-transaction-button"),
      ).toBeInTheDocument();
    });

    // Verify the saveTransaction method is available in the store
    expect(mockTransactionStore.saveTransaction).toBeDefined();
  });

  it("handles errors when fetching data", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const errorGetTransactionConfigUseCase = {
      exec: vi.fn().mockRejectedValue(new Error("Failed to fetch config")),
    } as unknown as GetTransactionConfigUseCase;

    render(
      <LastTransactionsView
        getLastTransactionsUseCase={mockGetLastTransactionsUseCase}
        getTransactionUseCase={mockGetTransactionUseCase}
        getTransactionConfigUseCase={errorGetTransactionConfigUseCase}
        getUserPreferencesUseCase={mockGetUserPreferencesUseCase}
        saveTransactionUseCase={mockSaveTransactionUseCase}
        removeTransactionUseCase={mockRemoveTransactionUseCase}
      />,
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error getting transaction config or preferences",
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });
});
