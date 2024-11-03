import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { defaultTransactionConfig, TransactionConfig } from "@domain/models";
import { TransactionBuilder } from "@test/builders";
import { useRepositories } from "@infrastructure/ui/hooks";
import { Router } from "wouter";
import { TestRouter } from "@test/TestRouter";
import { TransactionDetailsView } from "@views";

vi.mock("@infrastructure/ui/hooks", () => ({
  useRepositories: vi.fn(),
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
  const mockRemoveTransaction = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRepositories as Mock).mockReturnValue({
      isReady: true,
      repositories: {
        transaction: {
          findById: vi.fn().mockResolvedValue(mockTransaction),
          fetchTransactionConfig: vi.fn().mockResolvedValue(mockConfig),
          save: vi.fn(),
          remove: mockRemoveTransaction,
        },
      },
      isLoading: false,
      setIsLoading: mockSetIsLoading,
    });
  });

  it("renders Loader when loading is true", () => {
    (useRepositories as Mock).mockReturnValueOnce({
      isLoading: true,
    });

    render(<TransactionDetailsView />);
    expect(screen.getByText("Loader")).toBeInTheDocument();
  });

  it("renders transaction details and edit form after loading", async () => {
    render(
      <Router>
        <TestRouter path="/transactions/details/1" />
        <TransactionDetailsView />
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
    (useRepositories as Mock).mockReturnValueOnce({
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

    render(<TransactionDetailsView />);

    await waitFor(() => {
      expect(screen.getByText("Transaction not found.")).toBeInTheDocument();
    });
  });

  it("calls remove method on transaction removal", async () => {
    render(
      <Router>
        <TestRouter path="/transactions/details/1" />
        <TransactionDetailsView />
      </Router>,
    );

    await waitFor(() => {
      expect(
        screen.getByText("Edit form for Test Transaction"),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("🚮"));

    await waitFor(() => {
      expect(mockRemoveTransaction).toHaveBeenCalledWith(mockTransaction.id);
    });
  });

  it("handles errors during data fetching gracefully", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    (useRepositories as Mock).mockReturnValueOnce({
      isReady: true,
      repositories: {
        transaction: {
          findById: vi.fn().mockRejectedValue(new Error("Fetch error")),
          fetchTransactionConfig: vi.fn().mockResolvedValue(mockConfig),
        },
      },
      isLoading: false,
      setIsLoading: mockSetIsLoading,
    });

    render(<TransactionDetailsView />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error getting data");
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });
});
