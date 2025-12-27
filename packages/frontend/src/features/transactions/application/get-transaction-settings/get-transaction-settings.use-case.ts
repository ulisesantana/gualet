import { TransactionConfig } from "@domain/models";
import { UseCase } from "@common/application/use-case";
import { TransactionRepository } from "../transaction.repository";

export class GetTransactionConfigUseCase
  implements UseCase<number, Promise<TransactionConfig>>
{
  constructor(private readonly repository: TransactionRepository) {}

  async exec(): Promise<TransactionConfig> {
    return this.repository.fetchTransactionConfig();
  }
}
