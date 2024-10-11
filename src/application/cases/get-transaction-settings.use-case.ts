import { UserSettings } from "@domain/models";
import { UseCase } from "@application/cases/use-case";
import { TransactionRepository } from "@application/repositories";

export class GetTransactionConfig
  implements UseCase<number, Promise<UserSettings>>
{
  constructor(private readonly repository: TransactionRepository) {}

  async exec(): Promise<UserSettings> {
    return this.repository.fetchTransactionConfig();
  }
}
