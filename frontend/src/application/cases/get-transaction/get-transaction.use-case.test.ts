import { describe, expect, it, vi } from "vitest";
import { GetTransactionUseCase } from "@application/cases";
import { TransactionRepository } from "@application/repositories";
import { Id, Transaction } from "@domain/models";
import { TransactionNotFoundError } from "@domain/errors";
import { TransactionBuilder } from "@test/builders";

const mockRepository: TransactionRepository = {
  findById: vi.fn(),
} as unknown as TransactionRepository;

describe("GetTransactionUseCase", () => {
  it("should return a transaction when found", async () => {
    const transaction = new TransactionBuilder().withId(new Id("1")).build();
    mockRepository.findById = vi.fn().mockResolvedValue(transaction);

    const useCase = new GetTransactionUseCase(mockRepository);
    const result = await useCase.exec(new Id("1"));

    expect(result).toEqual(transaction);
    expect(mockRepository.findById).toHaveBeenCalledWith(new Id("1"));
  });

  it("should throw TransactionNotFoundError if transaction is not found", async () => {
    mockRepository.findById = vi.fn().mockResolvedValue(null);

    const useCase = new GetTransactionUseCase(mockRepository);

    await expect(useCase.exec(new Id("non-existent"))).rejects.toThrowError(
      new TransactionNotFoundError(new Id("non-existent")),
    );
    expect(mockRepository.findById).toHaveBeenCalledWith(
      new Id("non-existent"),
    );
  });
});
