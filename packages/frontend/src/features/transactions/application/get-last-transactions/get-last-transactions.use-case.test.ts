import { describe, expect, it, vi } from "vitest";
import { TransactionRepository } from "../transaction.repository";
import { GetLastTransactionsUseCase } from "../cases";
import { TransactionBuilder } from "@test/builders";

describe("GetLastTransactionsUseCase", () => {
  it("should return the last N transactions", async () => {
    // Mock the repository and data
    const mockRepository: TransactionRepository = {
      find: vi
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
    expect(mockRepository.find).toHaveBeenCalledWith({ page: 1, pageSize: 2 });
  });

  it("should return the last 10 transactions if no value is given", async () => {
    // Mock the repository and data
    const mockRepository: TransactionRepository = {
      find: vi.fn().mockResolvedValue([]),
    } as unknown as TransactionRepository;

    await new GetLastTransactionsUseCase(mockRepository).exec();

    expect(mockRepository.find).toHaveBeenCalledWith({ page: 1, pageSize: 10 });
  });

  it("should return an empty list if no transactions are found", async () => {
    // Mock the repository to return an empty array
    const mockRepository: TransactionRepository = {
      find: vi.fn().mockResolvedValue([]),
    } as unknown as TransactionRepository;

    const useCase = new GetLastTransactionsUseCase(mockRepository);
    const result = await useCase.exec(5);

    expect(result.length).toBe(0);
    expect(mockRepository.find).toHaveBeenCalledWith({ page: 1, pageSize: 5 });
  });
});
