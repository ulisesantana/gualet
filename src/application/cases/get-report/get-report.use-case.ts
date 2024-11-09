import { Report } from "@domain/models";
import {
  FindTransactionsCriteria,
  TransactionRepository,
} from "@application/repositories";
import { UseCase } from "@application/cases/use-case";

type Input = Required<Pick<FindTransactionsCriteria, "from" | "to">>;
type Output = Promise<Report>;

export class GetReportUseCase implements UseCase<Input, Output> {
  constructor(private readonly repository: TransactionRepository) {}
  async exec({ from, to }: Input): Promise<Report> {
    if (to.earlierThan(from)) {
      return this.exec({ from: to, to: from });
    }
    const transactions = await this.repository.find({ from, to });
    return new Report({ from, to, transactions });
  }
}
