import { describe, expect, it, vi } from "vitest";
import { TransactionRepository } from "@application/repositories";
import { GetLastTransactionsUseCase } from "@application/cases";
import { TransactionBuilder } from "@test/builders";
import { Transaction } from "@domain/models";

describe("GetLastTransactionsUseCase", () => {
  it("should return the last N transactions", async () => {
    // Mock the repository and data
    const mockRepository: TransactionRepository = {
      findLast: vi
        .fn()
        .mockResolvedValue([
          new TransactionBuilder().withAmount(500).build(),
          new TransactionBuilder().withAmount(300).build(),
        ]),
    } as unknown as TransactionRepository;

    const result = await new GetLastTransactionsUseCase(mockRepository).exec(2);

    expect(result.length).toBe(2);
    expect(result[0].amount).toBe(500);
    expect(result[1].amount).toBe(300);
    expect(mockRepository.findLast).toHaveBeenCalledWith(2);
  });

  it("should return the last 10 transactions if no value is given", async () => {
    // Mock the repository and data
    const mockRepository: TransactionRepository = {
      findLast: vi.fn().mockResolvedValue([]),
    } as unknown as TransactionRepository;

    await new GetLastTransactionsUseCase(mockRepository).exec();

    expect(mockRepository.findLast).toHaveBeenCalledWith(10);
  });

  it("should return an empty list if no transactions are found", async () => {
    // Mock the repository to return an empty array
    const mockRepository: TransactionRepository = {
      findLast: vi.fn().mockResolvedValue([]),
    } as unknown as TransactionRepository;

    const useCase = new GetLastTransactionsUseCase(mockRepository);
    const result = await useCase.exec(5);

    expect(result.length).toBe(0);
    expect(mockRepository.findLast).toHaveBeenCalledWith(5);
  });
});
