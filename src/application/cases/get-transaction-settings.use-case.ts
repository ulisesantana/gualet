import { UseCase } from "./use-case";
import { TransactionRepository } from "../repositories";
import { TransactionConfig } from "../../domain/models";

export class GetTransactionConfig
  implements UseCase<number, Promise<TransactionConfig>>
{
  constructor(private readonly repository: TransactionRepository) {}

  async exec(): Promise<TransactionConfig> {
    return this.repository.fetchTransactionConfig();
  }
}
