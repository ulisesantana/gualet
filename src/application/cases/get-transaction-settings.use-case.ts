import {UseCase} from "./use-case";
import {TransactionConfig, TransactionRepository} from "../repositories";

export class GetTransactionConfig implements UseCase<number, Promise<TransactionConfig>> {
  constructor(private readonly repository: TransactionRepository) {}

  async exec(): Promise<TransactionConfig> {
    return this.repository.fetchTransactionConfig()
  }
}
