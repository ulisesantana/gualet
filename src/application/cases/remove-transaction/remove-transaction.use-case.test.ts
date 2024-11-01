import { beforeEach, describe, expect, it, vi } from "vitest";
import { TransactionRepository } from "@application/repositories";
import { Id } from "@domain/models";
import { RemoveTransactionUseCase } from "@application/cases";

describe("RemoveTransactionUseCase", () => {
  let mockTransactionRepository: TransactionRepository;
  let removeTransactionUseCase: RemoveTransactionUseCase;

  beforeEach(() => {
    mockTransactionRepository = {
      remove: vi.fn(),
    } as unknown as TransactionRepository;
    removeTransactionUseCase = new RemoveTransactionUseCase(
      mockTransactionRepository as unknown as TransactionRepository,
    );
  });

  it("should remove a transaction by the given id", async () => {
    const transactionId: Id = new Id();

    await removeTransactionUseCase.exec(transactionId);

    expect(mockTransactionRepository.remove).toHaveBeenCalledWith(
      transactionId,
    );
  });
});
