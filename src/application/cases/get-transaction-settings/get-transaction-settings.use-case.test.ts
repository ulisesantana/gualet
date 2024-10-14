import { describe, expect, it, vi } from "vitest";
import { GetTransactionConfigUseCase } from "@application/cases";
import { TransactionRepository } from "@application/repositories";
import { defaultTransactionConfig, TransactionConfig } from "@domain/models";

const mockRepository: TransactionRepository = {
  fetchTransactionConfig: vi.fn(),
} as unknown as TransactionRepository;

describe("GetTransactionConfigUseCase", () => {
  it("should return the transaction configuration", async () => {
    const config: TransactionConfig = {
      ...defaultTransactionConfig,
    };
    mockRepository.fetchTransactionConfig = vi.fn().mockResolvedValue(config);

    const useCase = new GetTransactionConfigUseCase(mockRepository);
    const result = await useCase.exec();

    expect(result).toEqual(config);
    expect(mockRepository.fetchTransactionConfig).toHaveBeenCalled();
  });
});
