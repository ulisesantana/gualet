import { UseCase } from "@common/application/use-case";

import { Report } from "../../domain/report/report";
import {
  FindTransactionsCriteria,
  TransactionRepository,
} from "../../../transactions/application/transaction.repository";

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
