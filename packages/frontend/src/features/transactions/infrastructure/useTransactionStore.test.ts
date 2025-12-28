import { beforeEach, describe, expect, it, vi } from "vitest";
import { Category, Day, Id, OperationType, Transaction } from "@gualet/shared";
import { TransactionBuilder } from "@test/builders";

import { act, renderHook, waitFor } from "../../../../test/test-utils";
import {
  GetLastTransactionsUseCase,
  GetTransactionUseCase,
  RemoveTransactionUseCase,
  SaveTransactionUseCase,
} from "../application/cases";
import { setUseCases, useTransactionStore } from "./useTransactionStore";

describe("useTransactionStore", () => {
  // Mock use cases
  const mockGetLastTransactionsUseCase = {
    exec: vi.fn(),
  } as unknown as GetLastTransactionsUseCase;

  const mockGetTransactionUseCase = {
    exec: vi.fn(),
  } as unknown as GetTransactionUseCase;

  const mockSaveTransactionUseCase = {
    exec: vi.fn(),
  } as unknown as SaveTransactionUseCase;

  const mockRemoveTransactionUseCase = {
    exec: vi.fn(),
  } as unknown as RemoveTransactionUseCase;

  // Test data
  const mockCategory = new Category({
    id: new Id("cat-1"),
    name: "Food",
    type: OperationType.Outcome,
    icon: "🍔",
    color: "#FF5733",
  });

  const mockTransactions: Transaction[] = [
    new TransactionBuilder()
      .withId(new Id("tx-1"))
      .withAmount(50)
      .withDescription("Lunch")
      .withCategory(mockCategory)
      .withDate(new Day("2024-01-02"))
      .build(),
    new TransactionBuilder()
      .withId(new Id("tx-2"))
      .withAmount(100)
      .withDescription("Dinner")
      .withCategory(mockCategory)
      .withDate(new Day("2024-01-01"))
      .build(),
  ];

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Reset store state first
    useTransactionStore.getState().reset();

    // Then inject use cases
    setUseCases(
      mockGetLastTransactionsUseCase,
      mockGetTransactionUseCase,
      mockSaveTransactionUseCase,
      mockRemoveTransactionUseCase,
    );
  });

  describe("Initial State", () => {
    it("should have empty state initially", () => {
      const { result } = renderHook(() => useTransactionStore());

      expect(result.current.transactions).toEqual([]);
      expect(result.current.currentTransaction).toBe(null);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });

  describe("fetchLastTransactions", () => {
    it("should fetch transactions successfully (already sorted by backend)", async () => {
      // Mock returns transactions already sorted by date descending (backend does this)
      const sortedMockTransactions = [mockTransactions[0], mockTransactions[1]]; // tx-1 (2024-01-02), tx-2 (2024-01-01)
      vi.mocked(mockGetLastTransactionsUseCase.exec).mockResolvedValue(
        sortedMockTransactions,
      );

      const { result } = renderHook(() => useTransactionStore());

      // Start fetching
      act(() => {
        result.current.fetchLastTransactions(25);
      });

      // Should set loading state
      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBe(null);

      // Wait for async operation
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should have transactions in the order returned by backend (already sorted)
      expect(result.current.transactions).toHaveLength(2);
      expect(result.current.transactions[0].id.equals(new Id("tx-1"))).toBe(
        true,
      ); // 2024-01-02 (most recent)
      expect(result.current.transactions[1].id.equals(new Id("tx-2"))).toBe(
        true,
      ); // 2024-01-01
      expect(result.current.error).toBe(null);
      expect(mockGetLastTransactionsUseCase.exec).toHaveBeenCalledWith(25);
    });

    it("should use default limit when not provided", async () => {
      vi.mocked(mockGetLastTransactionsUseCase.exec).mockResolvedValue([]);

      const { result } = renderHook(() => useTransactionStore());

      act(() => {
        result.current.fetchLastTransactions();
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockGetLastTransactionsUseCase.exec).toHaveBeenCalledWith(25);
    });

    it("should handle fetch error", async () => {
      const errorMessage = "Failed to fetch from server";
      vi.mocked(mockGetLastTransactionsUseCase.exec).mockRejectedValue(
        new Error(errorMessage),
      );

      const { result } = renderHook(() => useTransactionStore());

      act(() => {
        result.current.fetchLastTransactions();
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.transactions).toEqual([]);
    });

    it("should not fetch if use case is not set", async () => {
      setUseCases(
        undefined as any,
        mockGetTransactionUseCase,
        mockSaveTransactionUseCase,
        mockRemoveTransactionUseCase,
      );

      const { result } = renderHook(() => useTransactionStore());

      await act(async () => {
        await result.current.fetchLastTransactions();
      });

      expect(result.current.transactions).toEqual([]);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("fetchTransaction", () => {
    it("should fetch single transaction successfully", async () => {
      const transaction = mockTransactions[0];
      vi.mocked(mockGetTransactionUseCase.exec).mockResolvedValue(transaction);

      const { result } = renderHook(() => useTransactionStore());

      act(() => {
        result.current.fetchTransaction(transaction.id);
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.currentTransaction).toEqual(transaction);
      expect(result.current.error).toBe(null);
      expect(mockGetTransactionUseCase.exec).toHaveBeenCalledWith(
        transaction.id,
      );
    });

    it("should handle fetch error", async () => {
      const errorMessage = "Transaction not found";
      vi.mocked(mockGetTransactionUseCase.exec).mockRejectedValue(
        new Error(errorMessage),
      );

      const { result } = renderHook(() => useTransactionStore());

      act(() => {
        result.current.fetchTransaction(new Id("invalid-id"));
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.currentTransaction).toBe(null);
    });

    it("should not fetch if use case is not set", async () => {
      setUseCases(
        mockGetLastTransactionsUseCase,
        undefined as any,
        mockSaveTransactionUseCase,
        mockRemoveTransactionUseCase,
      );

      const { result } = renderHook(() => useTransactionStore());

      await act(async () => {
        await result.current.fetchTransaction(new Id("tx-1"));
      });

      expect(result.current.currentTransaction).toBe(null);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("saveTransaction", () => {
    it("should add new transaction to list", async () => {
      const newTransaction = new TransactionBuilder()
        .withId(new Id("tx-3"))
        .withAmount(75)
        .withDescription("Breakfast")
        .withCategory(mockCategory)
        .withDate(new Day("2024-01-03"))
        .build();

      vi.mocked(mockSaveTransactionUseCase.exec).mockResolvedValue();

      const { result } = renderHook(() => useTransactionStore());

      // Set initial transactions
      act(() => {
        useTransactionStore.setState({ transactions: mockTransactions });
      });

      await act(async () => {
        await result.current.saveTransaction(newTransaction);
      });

      expect(result.current.transactions).toHaveLength(3);
      // New transaction is added at the beginning (optimistic update)
      // Note: Final sorting should be done by backend on next fetch
      expect(result.current.transactions[0].id.equals(new Id("tx-3"))).toBe(
        true,
      );
      expect(result.current.currentTransaction).toEqual(newTransaction);
      expect(mockSaveTransactionUseCase.exec).toHaveBeenCalledWith(
        newTransaction,
      );
    });

    it("should update existing transaction", async () => {
      const updatedTransaction = new TransactionBuilder()
        .withId(new Id("tx-1"))
        .withAmount(150)
        .withDescription("Updated Lunch")
        .withCategory(mockCategory)
        .withDate(new Day("2024-01-02"))
        .build();

      vi.mocked(mockSaveTransactionUseCase.exec).mockResolvedValue();

      const { result } = renderHook(() => useTransactionStore());

      // Set initial transactions
      act(() => {
        useTransactionStore.setState({ transactions: mockTransactions });
      });

      await act(async () => {
        await result.current.saveTransaction(updatedTransaction);
      });

      expect(result.current.transactions).toHaveLength(2);
      const updated = result.current.transactions.find((t) =>
        t.id.equals(new Id("tx-1")),
      );
      expect(updated?.amount).toBe(150);
      expect(updated?.description).toBe("Updated Lunch");
      expect(result.current.currentTransaction).toEqual(updatedTransaction);
    });

    it("should handle save error", async () => {
      const errorMessage = "Failed to save";
      const transaction = mockTransactions[0];
      vi.mocked(mockSaveTransactionUseCase.exec).mockRejectedValue(
        new Error(errorMessage),
      );

      const { result } = renderHook(() => useTransactionStore());

      // Try to save - should throw
      await expect(async () => {
        await result.current.saveTransaction(transaction);
      }).rejects.toThrow();

      // Check error directly from store state
      const storeState = useTransactionStore.getState();
      expect(storeState.error).toBe(errorMessage);
    });

    it("should not save if use case is not set", async () => {
      setUseCases(
        mockGetLastTransactionsUseCase,
        mockGetTransactionUseCase,
        undefined as any,
        mockRemoveTransactionUseCase,
      );

      const { result } = renderHook(() => useTransactionStore());

      await act(async () => {
        await result.current.saveTransaction(mockTransactions[0]);
      });

      expect(mockSaveTransactionUseCase.exec).not.toHaveBeenCalled();
    });
  });

  describe("removeTransaction", () => {
    it("should remove transaction from list", async () => {
      vi.mocked(mockRemoveTransactionUseCase.exec).mockResolvedValue();

      const { result } = renderHook(() => useTransactionStore());

      // Set initial transactions
      act(() => {
        useTransactionStore.setState({ transactions: mockTransactions });
      });

      await act(async () => {
        await result.current.removeTransaction(new Id("tx-1"));
      });

      expect(result.current.transactions).toHaveLength(1);
      expect(result.current.transactions[0].id.equals(new Id("tx-2"))).toBe(
        true,
      );
      expect(result.current.currentTransaction).toBe(null);
      expect(mockRemoveTransactionUseCase.exec).toHaveBeenCalledWith(
        new Id("tx-1"),
      );
    });

    it("should handle remove error", async () => {
      const errorMessage = "Failed to remove";
      vi.mocked(mockRemoveTransactionUseCase.exec).mockRejectedValue(
        new Error(errorMessage),
      );

      const { result } = renderHook(() => useTransactionStore());

      // Try to remove - should throw
      await expect(async () => {
        await result.current.removeTransaction(new Id("tx-1"));
      }).rejects.toThrow();

      // Check error directly from store state
      const storeState = useTransactionStore.getState();
      expect(storeState.error).toBe(errorMessage);
    });

    it("should not remove if use case is not set", async () => {
      setUseCases(
        mockGetLastTransactionsUseCase,
        mockGetTransactionUseCase,
        mockSaveTransactionUseCase,
        undefined as any,
      );

      const { result } = renderHook(() => useTransactionStore());

      await act(async () => {
        await result.current.removeTransaction(new Id("tx-1"));
      });

      expect(mockRemoveTransactionUseCase.exec).not.toHaveBeenCalled();
    });
  });

  describe("reset", () => {
    it("should reset store to initial state", () => {
      const { result } = renderHook(() => useTransactionStore());

      // Set some state
      act(() => {
        useTransactionStore.setState({
          transactions: mockTransactions,
          currentTransaction: mockTransactions[0],
          isLoading: true,
          error: "Some error",
        });
      });

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.transactions).toEqual([]);
      expect(result.current.currentTransaction).toBe(null);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });
});
