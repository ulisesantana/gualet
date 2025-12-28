import { beforeEach, describe, expect, it, type Mocked, vi } from "vitest";
import { Transaction } from "@gualet/shared";
import { TransactionBuilder } from "@test/builders";

import { SaveTransactionUseCase } from "../cases";
import { TransactionRepository } from "../transaction.repository";

describe("Save transaction use case", () => {
  let mockTransactionRepository: Mocked<TransactionRepository>;
  let saveTransactionUseCase: SaveTransactionUseCase;

  beforeEach(() => {
    mockTransactionRepository = {
      create: vi.fn(),
      update: vi.fn(),
    } as unknown as Mocked<TransactionRepository>;
    saveTransactionUseCase = new SaveTransactionUseCase(
      mockTransactionRepository,
    );
  });

  it("should create a new transaction when it's new", async () => {
    const transaction: Transaction = new TransactionBuilder().build();
    // Mock isNew() to return true
    vi.spyOn(transaction, "isNew").mockReturnValue(true);

    await saveTransactionUseCase.exec(transaction);

    expect(mockTransactionRepository.create).toHaveBeenCalledWith(transaction);
    expect(mockTransactionRepository.update).not.toHaveBeenCalled();
  });

  it("should update an existing transaction when it's not new", async () => {
    const transaction: Transaction = new TransactionBuilder().build();
    // Mock isNew() to return false
    vi.spyOn(transaction, "isNew").mockReturnValue(false);

    await saveTransactionUseCase.exec(transaction);

    expect(mockTransactionRepository.update).toHaveBeenCalledWith(transaction);
    expect(mockTransactionRepository.create).not.toHaveBeenCalled();
  });

  it("should throw an error if repository fails to create transaction", async () => {
    const transaction: Transaction = new TransactionBuilder().build();
    vi.spyOn(transaction, "isNew").mockReturnValue(true);

    // Simulate an error during save
    mockTransactionRepository.create.mockRejectedValue(
      new Error("Failed to save transaction"),
    );

    await expect(saveTransactionUseCase.exec(transaction)).rejects.toThrow(
      "Failed to save transaction",
    );
  });

  it("should throw an error if repository fails to update transaction", async () => {
    const transaction: Transaction = new TransactionBuilder().build();
    vi.spyOn(transaction, "isNew").mockReturnValue(false);

    // Simulate an error during update
    mockTransactionRepository.update.mockRejectedValue(
      new Error("Failed to update transaction"),
    );

    await expect(saveTransactionUseCase.exec(transaction)).rejects.toThrow(
      "Failed to update transaction",
    );
  });
});
