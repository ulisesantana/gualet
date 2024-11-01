import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import { SaveTransactionUseCase } from "@application/cases";
import { TransactionRepository } from "@application/repositories";
import { Transaction } from "@domain/models";
import { TransactionBuilder } from "@test/builders";

describe("Save transaction use case", () => {
  let mockTransactionRepository: Mocked<TransactionRepository>;
  let saveTransactionUseCase: SaveTransactionUseCase;

  beforeEach(() => {
    mockTransactionRepository = {
      save: vi.fn(),
    } as unknown as Mocked<TransactionRepository>;
    saveTransactionUseCase = new SaveTransactionUseCase(
      mockTransactionRepository,
    );
  });

  it("should save a transaction", async () => {
    const transaction: Transaction = new TransactionBuilder().build();

    await saveTransactionUseCase.exec(transaction);

    expect(mockTransactionRepository.save).toHaveBeenCalledWith(transaction);
  });

  it("should throw an error if repository fails to save transaction", async () => {
    const transaction: Transaction = new TransactionBuilder().build();

    // Simulate an error during save
    mockTransactionRepository.save.mockRejectedValue(
      new Error("Failed to save transaction"),
    );

    await expect(saveTransactionUseCase.exec(transaction)).rejects.toThrow(
      "Failed to save transaction",
    );
  });
});
