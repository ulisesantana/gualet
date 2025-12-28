import { create } from "zustand";
import { Id, Transaction } from "@gualet/shared";

import {
  GetLastTransactionsUseCase,
  GetTransactionUseCase,
  RemoveTransactionUseCase,
  SaveTransactionUseCase,
} from "../application/cases";

interface TransactionStore {
  // State
  transactions: Transaction[];
  currentTransaction: Transaction | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchLastTransactions: (limit?: number) => Promise<void>;
  fetchTransaction: (transactionId: Id) => Promise<void>;
  saveTransaction: (transaction: Transaction) => Promise<void>;
  removeTransaction: (transactionId: Id) => Promise<void>;
  reset: () => void;
}

// Use cases will be injected via setters
let getLastTransactionsUseCase: GetLastTransactionsUseCase;
let getTransactionUseCase: GetTransactionUseCase;
let saveTransactionUseCase: SaveTransactionUseCase;
let removeTransactionUseCase: RemoveTransactionUseCase;

export const setUseCases = (
  getLastUseCase: GetLastTransactionsUseCase,
  getUseCase: GetTransactionUseCase,
  saveUseCase: SaveTransactionUseCase,
  removeUseCase: RemoveTransactionUseCase,
) => {
  getLastTransactionsUseCase = getLastUseCase;
  getTransactionUseCase = getUseCase;
  saveTransactionUseCase = saveUseCase;
  removeTransactionUseCase = removeUseCase;
};

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  // Initial state
  transactions: [],
  currentTransaction: null,
  isLoading: false,
  error: null,

  // Fetch last transactions
  fetchLastTransactions: async (limit = 25) => {
    if (!getLastTransactionsUseCase) {
      console.error("getLastTransactionsUseCase not set");
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const transactions = await getLastTransactionsUseCase.exec(limit);
      // Backend returns transactions already sorted by date descending
      set({ transactions, isLoading: false });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch transactions",
        isLoading: false,
      });
    }
  },

  // Fetch single transaction
  fetchTransaction: async (transactionId: Id) => {
    if (!getTransactionUseCase) {
      console.error("getTransactionUseCase not set");
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const transaction = await getTransactionUseCase.exec(transactionId);
      set({ currentTransaction: transaction, isLoading: false });
    } catch (error) {
      console.error("Error fetching transaction:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch transaction",
        isLoading: false,
      });
    }
  },

  // Save transaction (create or update)
  saveTransaction: async (transaction: Transaction) => {
    if (!saveTransactionUseCase) {
      console.warn("saveTransactionUseCase not set");
      return;
    }

    try {
      await saveTransactionUseCase.exec(transaction);

      // Update state optimistically
      const { transactions } = get();
      const existingIndex = transactions.findIndex((t) =>
        t.id.equals(transaction.id),
      );

      let updatedTransactions: Transaction[];
      if (existingIndex >= 0) {
        // Update existing transaction
        updatedTransactions = [...transactions];
        updatedTransactions[existingIndex] = transaction;
      } else {
        // Add new transaction
        updatedTransactions = [transaction, ...transactions];
      }

      // Note: Transactions are already sorted by backend
      // If consistency is needed, refetch from backend instead
      set({
        transactions: updatedTransactions,
        currentTransaction: transaction,
      });
    } catch (error) {
      console.error("Error saving transaction:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to save transaction",
      });
      throw error; // Re-throw so UI can handle it
    }
  },

  // Remove transaction and refresh list
  removeTransaction: async (transactionId: Id) => {
    if (!removeTransactionUseCase) {
      console.warn("removeTransactionUseCase not set");
      return;
    }

    try {
      await removeTransactionUseCase.exec(transactionId);

      // Update state optimistically
      const { transactions } = get();
      const updatedTransactions = transactions.filter(
        (t) => !t.id.equals(transactionId),
      );

      set({ transactions: updatedTransactions, currentTransaction: null });
    } catch (error) {
      console.error("Error removing transaction:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to remove transaction",
      });
      throw error; // Re-throw so UI can handle it
    }
  },

  // Reset store (useful for testing)
  reset: () =>
    set({
      transactions: [],
      currentTransaction: null,
      isLoading: false,
      error: null,
    }),
}));
