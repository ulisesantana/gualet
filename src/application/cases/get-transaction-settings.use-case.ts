import {UseCase} from "./use-case";
import {TransactionSettings, TransactionRepository} from "../repositories";

export class GetTransactionSettings implements UseCase<number, Promise<TransactionSettings>> {
  constructor(private readonly repository: TransactionRepository) {}

  async exec(): Promise<TransactionSettings> {
    return this.repository.fetchTransactionSettings()
  }
}
