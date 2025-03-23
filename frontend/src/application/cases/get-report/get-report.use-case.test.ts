import { Day, Report } from "@domain/models";
import { TransactionRepository } from "@application/repositories";
import { TransactionBuilder } from "@test/builders";
import { Mocked, vi } from "vitest";
import { GetReportUseCase } from "@application/cases";

describe("GetReportUseCase", () => {
  let mockRepository: Mocked<TransactionRepository>;
  let getReportUseCase: GetReportUseCase;

  beforeEach(() => {
    mockRepository = {
      find: vi.fn(),
    } as unknown as Mocked<TransactionRepository>;
    getReportUseCase = new GetReportUseCase(mockRepository);
  });

  it("should return a Report with transactions within the date range", async () => {
    const dayFrom = new Day("2023-01-01");
    const dayTo = new Day("2023-01-31");

    const transactions = [
      new TransactionBuilder().withAmount(100).build(),
      new TransactionBuilder().withAmount(200).build(),
    ];

    mockRepository.find.mockResolvedValue(transactions);

    const result = await getReportUseCase.exec({ from: dayFrom, to: dayTo });

    expect(mockRepository.find).toHaveBeenCalledWith({
      from: dayFrom,
      to: dayTo,
    });
    expect(result).toBeInstanceOf(Report);
    expect(result.incomeReport.total + result.outcomeReport.total).toBe(-300);
  });

  it("should swap from and to dates if from is later than to", async () => {
    const dayFrom = new Day("2023-02-01");
    const dayTo = new Day("2023-01-01");

    const transactions = [
      new TransactionBuilder().withAmount(150).build(),
      new TransactionBuilder().withAmount(250).build(),
    ];

    mockRepository.find.mockResolvedValue(transactions);

    const result = await getReportUseCase.exec({ from: dayFrom, to: dayTo });

    expect(mockRepository.find).toHaveBeenCalledWith({
      from: dayTo,
      to: dayFrom,
    });
    expect(result).toBeInstanceOf(Report);
    expect(result.incomeReport.total + result.outcomeReport.total).toBe(-400);
  });

  it("should handle empty transactions list", async () => {
    const dayFrom = new Day("2023-01-01");
    const dayTo = new Day("2023-01-31");

    mockRepository.find.mockResolvedValue([]);

    const result = await getReportUseCase.exec({ from: dayFrom, to: dayTo });

    expect(mockRepository.find).toHaveBeenCalledWith({
      from: dayFrom,
      to: dayTo,
    });
    expect(result).toBeInstanceOf(Report);
    expect(result.total).toBe(0);
  });
});
