import { Transaction } from "@domain/models";
import { TransactionRepository } from "@application/repositories";

import { UseCase } from "./use-case";

export class AddTransaction implements UseCase<Transaction, Promise<void>> {
  constructor(private readonly repository: TransactionRepository) {}

  exec(transaction: Transaction): Promise<void> {
    return this.repository.save(transaction);
  }
}
