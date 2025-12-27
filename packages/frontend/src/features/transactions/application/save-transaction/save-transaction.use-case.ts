import { Transaction } from "@gualet/shared";
import { UseCase } from "@common/application/use-case";

import { TransactionRepository } from "../transaction.repository";

export class SaveTransactionUseCase
  implements UseCase<Transaction, Promise<void>>
{
  constructor(private readonly repository: TransactionRepository) {}

  async exec(transaction: Transaction): Promise<void> {
    if (transaction.isNew()) {
      await this.repository.create(transaction);
    } else {
      await this.repository.update(transaction);
    }
  }
}
