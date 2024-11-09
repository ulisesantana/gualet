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
  async exec(input: Input) {
    let from = input.from;
    let to = input.to;
    if (from && to && to.earlierThan(from)) {
      from = input.to;
      to = input.from;
    }
    const transactions = await this.repository.find({ from, to });
    return new Report({ from, to, transactions });
  }
}
