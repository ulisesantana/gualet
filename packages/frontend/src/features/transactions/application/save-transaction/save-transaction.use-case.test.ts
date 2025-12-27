import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import { SaveTransactionUseCase } from "../cases";
import { TransactionRepository } from "../transaction.repository";
import { Transaction } from "@gualet/shared";
import { TransactionBuilder } from "@test/builders";

describe("Save transaction use case", () => {
  let mockTransactionRepository: Mocked<TransactionRepository>;
  let saveTransactionUseCase: SaveTransactionUseCase;

  beforeEach(() => {
    mockTransactionRepository = {
      create: vi.fn(),
    } as unknown as Mocked<TransactionRepository>;
    saveTransactionUseCase = new SaveTransactionUseCase(
      mockTransactionRepository,
    );
  });

  it("should save a transaction", async () => {
    const transaction: Transaction = new TransactionBuilder().build();

    await saveTransactionUseCase.exec(transaction);

    expect(mockTransactionRepository.create).toHaveBeenCalledWith(transaction);
  });

  it("should throw an error if repository fails to save transaction", async () => {
    const transaction: Transaction = new TransactionBuilder().build();

    // Simulate an error during save
    mockTransactionRepository.create.mockRejectedValue(
      new Error("Failed to save transaction"),
    );

    await expect(saveTransactionUseCase.exec(transaction)).rejects.toThrow(
      "Failed to save transaction",
    );
  });
});
