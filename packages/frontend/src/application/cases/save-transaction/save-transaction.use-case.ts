import { TransactionRepository } from "@application/repositories";
import { Transaction } from "@gualet/core";

import { UseCase } from "../use-case";

export class SaveTransactionUseCase
  implements UseCase<Transaction, Promise<void>>
{
  constructor(private readonly repository: TransactionRepository) {}

  async exec(transaction: Transaction): Promise<void> {
    await this.repository.create(transaction);
  }
}
