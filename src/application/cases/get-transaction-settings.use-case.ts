import { TransactionConfig } from "@domain/models";
import { UseCase } from "@application/cases/use-case";
import { TransactionRepository } from "@application/repositories";

export class GetTransactionConfig
  implements UseCase<number, Promise<TransactionConfig>>
{
  constructor(private readonly repository: TransactionRepository) {}

  async exec(): Promise<TransactionConfig> {
    return this.repository.fetchTransactionConfig();
  }
}
